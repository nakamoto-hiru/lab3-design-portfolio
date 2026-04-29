import { useRef, useEffect, useCallback, useState } from 'react'

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_hover;
  uniform float u_radius;

  void main() {
    vec2 uv = v_texCoord;

    // Distance from mouse — effect only within radius
    float dist = distance(uv, u_mouse);
    float radius = u_radius;
    float proximity = smoothstep(radius, 0.0, dist);
    float strength = u_hover * proximity;

    // Water ripple from mouse — localized
    float ripple = sin(dist * 37.5 - u_time * 3.6) * exp(-dist * 4.5);

    // Organic wave layers — only near cursor
    float nx = sin(uv.y * 18.0 + u_time * 1.8) * 0.012;
    float ny = cos(uv.x * 15.0 + u_time * 1.35) * 0.009;

    vec2 offset = vec2(
      ripple * 0.045 + nx,
      ripple * 0.03 + ny
    ) * strength;

    // RGB split — 3 copies of text, each offset in different direction, pure R/G/B
    float spread = strength * 0.06;
    vec2 dir = normalize(uv - u_mouse + 0.001);

    // Red copy — offset along mouse direction
    float r = texture2D(u_texture, uv + offset + dir * spread).a * 1.0;

    // Green copy — offset perpendicular
    vec2 perp = vec2(-dir.y, dir.x);
    float g = texture2D(u_texture, uv + offset + perp * spread).a * 1.0;

    // Blue copy — offset opposite
    float b = texture2D(u_texture, uv + offset - dir * spread * 0.8).a * 1.0;

    // Original white text on top (where no offset)
    float original = texture2D(u_texture, uv + offset).a;
    r = max(r, original);
    g = max(g, original);
    b = max(b, original);

    float a = max(max(r, g), b);

    // Multiply output by strength so canvas is fully transparent when idle
    // (DOM text underneath provides the base render). Canvas only contributes
    // the ripple/RGB-split effect within the hover radius around the cursor.
    gl_FragColor = vec4(r, g, b, a) * strength;
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type)!; gl.shaderSource(s, source); gl.compileShader(s); return s
}
function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()!; gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p); return p
}
function measureFontMetrics(font: string) {
  const c = document.createElement('canvas'); const ctx = c.getContext('2d')!; ctx.font = font
  const m = ctx.measureText('Mpgyq|SÅ')
  return { ascent: m.actualBoundingBoxAscent, descent: m.actualBoundingBoxDescent }
}

interface Props { children: React.ReactNode; className?: string; style?: React.CSSProperties; radius?: number }

export default function LiquidText({ children, className, style, radius = 0.25 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const rafRef = useRef(0)
  const startTimeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const hoverRef = useRef(0)
  const hoverTargetRef = useRef(0)
  const [canvasReady, setCanvasReady] = useState(false)

  const initGL = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true }); if (!gl) return
    glRef.current = gl
    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = createProgram(gl, vs, fs); programRef.current = program; gl.useProgram(program)

    const posBuf = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc); gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const texBuf = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, texBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,1,1,1,0,0,0,0,1,1,1,0]), gl.STATIC_DRAW)
    const texLoc = gl.getAttribLocation(program, 'a_texCoord')
    gl.enableVertexAttribArray(texLoc); gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()!; textureRef.current = tex; gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  }, [])

  const captureText = useCallback(async () => {
    const textEl = textRef.current; const glCanvas = canvasRef.current; const gl = glRef.current
    if (!textEl || !glCanvas || !gl) return
    const dpr = window.devicePixelRatio || 1
    const cs = getComputedStyle(textEl)
    const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const fontSize = parseFloat(cs.fontSize)
    // Explicitly load this font/size — `document.fonts.ready` doesn't guarantee
    // lazy-loaded Google Fonts (e.g., Bodoni Moda) are available at the requested size
    try { await document.fonts.load(font) } catch { /* best effort */ }
    const rect = textEl.getBoundingClientRect()
    // Bail if text hasn't been laid out yet — keep textRef visible until next observer tick
    if (rect.width < 4 || rect.height < 4) { setCanvasReady(false); return }
    const lines: string[] = []; let cur = ''
    textEl.childNodes.forEach(n => { if (n.nodeName === 'BR') { lines.push(cur); cur = '' } else cur += n.textContent ?? '' })
    if (cur) lines.push(cur)
    if (!lines.length || !lines.some(l => l.trim())) { setCanvasReady(false); return }
    const metrics = measureFontMetrics(font)
    const computedLH = parseFloat(cs.lineHeight)
    const lh = isNaN(computedLH) ? fontSize * 1 : computedLH
    const padTop = metrics.ascent * 0.15  // Extra space for tall glyphs
    const totalH = padTop + lh * lines.length + metrics.descent
    // Extra padding so the liquid/RGB-split effect doesn't clip at edges
    const pad = Math.round(fontSize * 0.25)
    // Half-leading offset: when CSS line-height < 1 (e.g. leading-[0.8]),
    // glyphs render above the textEl box. Compensate so canvas glyphs land at
    // the same vertical position as DOM glyphs — prevents jump on cross-fade.
    const halfLeading = (lh - fontSize) / 2
    const w = Math.round(rect.width * dpr + pad * 2 * dpr); const h = Math.round(totalH * dpr + pad * 2 * dpr)
    glCanvas.width = w; glCanvas.height = h
    glCanvas.style.width = `${rect.width + pad * 2}px`; glCanvas.style.height = `${totalH + pad * 2}px`
    glCanvas.style.left = `${-pad}px`; glCanvas.style.top = `${-pad - padTop + halfLeading}px`
    gl.viewport(0, 0, w, h)
    const off = document.createElement('canvas'); off.width = w; off.height = h
    const ctx = off.getContext('2d')!; ctx.scale(dpr, dpr); ctx.font = font; ctx.fillStyle = cs.color; ctx.textBaseline = 'top'
    if (cs.letterSpacing !== 'normal' && 'letterSpacing' in ctx) (ctx as CanvasRenderingContext2D).letterSpacing = cs.letterSpacing
    lines.forEach((l, i) => ctx.fillText(l, pad, pad + padTop + i * lh))
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off)
    setCanvasReady(true)
  }, [])

  const renderStatic = useCallback(() => {
    const gl = glRef.current; const p = programRef.current; if (!gl || !p) return
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1f(gl.getUniformLocation(p, 'u_time'), 0)
    gl.uniform2f(gl.getUniformLocation(p, 'u_mouse'), 0.5, 0.5)
    gl.uniform1f(gl.getUniformLocation(p, 'u_hover'), 0)
    gl.uniform1f(gl.getUniformLocation(p, 'u_radius'), radius)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }, [])

  const render = useCallback(() => {
    const gl = glRef.current; const p = programRef.current; if (!gl || !p) return
    hoverRef.current += (hoverTargetRef.current - hoverRef.current) * 0.09
    const time = (performance.now() - startTimeRef.current) / 1000
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1f(gl.getUniformLocation(p, 'u_time'), time)
    gl.uniform2f(gl.getUniformLocation(p, 'u_mouse'), mouseRef.current.x, mouseRef.current.y)
    gl.uniform1f(gl.getUniformLocation(p, 'u_hover'), hoverRef.current)
    gl.uniform1f(gl.getUniformLocation(p, 'u_radius'), radius)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    if (hoverTargetRef.current === 0 && hoverRef.current < 0.01) { hoverRef.current = 0; renderStatic(); return }
    rafRef.current = requestAnimationFrame(render)
  }, [renderStatic])

  useEffect(() => {
    initGL(); startTimeRef.current = performance.now()
    let scheduled = 0
    const recapture = () => {
      cancelAnimationFrame(scheduled)
      scheduled = requestAnimationFrame(() => requestAnimationFrame(() => captureText()))
    }
    // Initial capture once fonts are ready
    document.fonts.ready.then(recapture)
    // Recapture when text element resizes (font loads, viewport changes affecting clamp())
    const ro = textRef.current ? new ResizeObserver(recapture) : null
    if (ro && textRef.current) ro.observe(textRef.current)
    // Recapture if any new fonts finish loading after mount (Google Fonts lazy load)
    const onFontLoadingDone = () => recapture()
    document.fonts.addEventListener?.('loadingdone', onFontLoadingDone)
    const onResize = () => { setCanvasReady(false); recapture() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafRef.current); cancelAnimationFrame(scheduled)
      window.removeEventListener('resize', onResize)
      document.fonts.removeEventListener?.('loadingdone', onFontLoadingDone)
      ro?.disconnect()
    }
  }, [initGL, captureText])

  useEffect(() => { if (canvasReady) renderStatic() }, [canvasReady, renderStatic])

  const onEnter = useCallback(() => {
    if (!canvasReady) return  // No texture captured yet — keep DOM-only static state
    hoverTargetRef.current = 1; cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(render)
  }, [render, canvasReady])
  const onLeave = useCallback(() => { hoverTargetRef.current = 0 }, [])
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect(); if (!r) return
    mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
  }, [])

  return (
    <div ref={containerRef} className="relative cursor-pointer overflow-visible" onMouseEnter={onEnter} onMouseLeave={onLeave} onMouseMove={onMove}>
      <div ref={textRef} className={className} style={style}>{children}</div>
      <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none" />
    </div>
  )
}
