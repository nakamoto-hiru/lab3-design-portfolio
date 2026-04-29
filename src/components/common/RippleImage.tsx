import { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from 'react'

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
  uniform vec2 u_drop;
  uniform float u_dropTime;
  uniform float u_hover;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = v_texCoord;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 scaled = vec2(uv.x * aspect, uv.y);
    vec2 dropScaled = vec2(u_drop.x * aspect, u_drop.y);

    float dist = distance(scaled, dropScaled);

    // Proximity-based ripple that follows the cursor
    float radius = 0.35;
    float proximity = smoothstep(radius, 0.0, dist);

    // Concentric ripples around cursor
    float wave = sin(dist * 40.0 - u_time * 4.0) * exp(-dist * 6.0);
    wave *= proximity * u_hover;

    vec2 dir = normalize(uv - u_drop + 0.0001);
    vec2 offset = dir * wave * 0.02;

    // Chromatic aberration
    float spread = wave * 0.008;
    float r = texture2D(u_texture, uv + offset + dir * spread).r;
    float g = texture2D(u_texture, uv + offset).g;
    float b = texture2D(u_texture, uv + offset - dir * spread).b;
    float a = texture2D(u_texture, uv + offset).a;

    gl_FragColor = vec4(r, g, b, a);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, source)
  gl.compileShader(s)
  return s
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  return p
}

export interface RippleImageHandle {
  dropAt: (x: number, y: number) => void
  setHover: (hovering: boolean) => void
}

interface Props {
  src: string
  alt?: string
  className?: string
}

const RippleImage = forwardRef<RippleImageHandle, Props>(({ src, alt = '', className = '' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgElRef = useRef<HTMLImageElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const textureRef = useRef<WebGLTexture | null>(null)
  const rafRef = useRef(0)
  const releaseTimerRef = useRef<number>(0)
  const startTimeRef = useRef(0)
  const dropTimeRef = useRef(0)
  const dropRef = useRef({ x: 0.5, y: 0.5 })
  const hoverRef = useRef(0)
  const hoverTargetRef = useRef(0)
  const isInitedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const renderRef = useRef<() => void>(() => {})

  const initGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true })
    if (!gl) return
    glRef.current = gl

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = createProgram(gl, vs, fs)
    programRef.current = program
    gl.useProgram(program)

    const posBuf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const texBuf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW)
    const texLoc = gl.getAttribLocation(program, 'a_texCoord')
    gl.enableVertexAttribArray(texLoc)
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()!
    textureRef.current = tex
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }, [])

  const uploadImage = useCallback(() => {
    const gl = glRef.current
    const img = imgElRef.current
    const canvas = canvasRef.current
    if (!gl || !img || !canvas || !img.complete || img.naturalWidth === 0) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    gl.viewport(0, 0, canvas.width, canvas.height)

    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

    const p = programRef.current
    if (p) {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(gl.getUniformLocation(p, 'u_time'), 0)
      gl.uniform2f(gl.getUniformLocation(p, 'u_drop'), 0.5, 0.5)
      gl.uniform1f(gl.getUniformLocation(p, 'u_dropTime'), 0)
      gl.uniform1f(gl.getUniformLocation(p, 'u_hover'), 0)
      gl.uniform2f(gl.getUniformLocation(p, 'u_resolution'), canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    setReady(true)
  }, [])

  const render = useCallback(() => {
    const gl = glRef.current
    const p = programRef.current
    const canvas = canvasRef.current
    if (!gl || !p || !canvas) return

    hoverRef.current += (hoverTargetRef.current - hoverRef.current) * 0.08
    const time = (performance.now() - startTimeRef.current) / 1000

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1f(gl.getUniformLocation(p, 'u_time'), time)
    gl.uniform2f(gl.getUniformLocation(p, 'u_drop'), dropRef.current.x, dropRef.current.y)
    gl.uniform1f(gl.getUniformLocation(p, 'u_dropTime'), dropTimeRef.current)
    gl.uniform1f(gl.getUniformLocation(p, 'u_hover'), hoverRef.current)
    gl.uniform2f(gl.getUniformLocation(p, 'u_resolution'), canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    const elapsed = time - dropTimeRef.current
    if (hoverTargetRef.current === 0 && hoverRef.current < 0.01 && elapsed > 3) return
    rafRef.current = requestAnimationFrame(render)
  }, [])

  renderRef.current = render

  const ensureInited = useCallback(() => {
    if (isInitedRef.current) return
    initGL()
    if (!glRef.current) return
    isInitedRef.current = true
    startTimeRef.current = performance.now()

    const img = imgElRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      uploadImage()
    } else if (img) {
      const onLoad = () => {
        img.removeEventListener('load', onLoad)
        if (isInitedRef.current) uploadImage()
      }
      img.addEventListener('load', onLoad)
    }
  }, [initGL, uploadImage])

  const release = useCallback(() => {
    if (!isInitedRef.current) return
    isInitedRef.current = false
    cancelAnimationFrame(rafRef.current)
    const gl = glRef.current
    if (gl) {
      if (textureRef.current) gl.deleteTexture(textureRef.current)
      if (programRef.current) gl.deleteProgram(programRef.current)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    glRef.current = null
    programRef.current = null
    textureRef.current = null
    hoverRef.current = 0
    hoverTargetRef.current = 0
    setReady(false)
  }, [])

  useImperativeHandle(ref, () => ({
    dropAt(x: number, y: number) {
      ensureInited()
      const r = containerRef.current?.getBoundingClientRect()
      if (!r) return
      dropRef.current = { x: (x - r.left) / r.width, y: (y - r.top) / r.height }
      if (dropTimeRef.current === 0) {
        dropTimeRef.current = (performance.now() - startTimeRef.current) / 1000
      }
    },
    setHover(hovering: boolean) {
      hoverTargetRef.current = hovering ? 1 : 0
      if (hovering) {
        ensureInited()
        if (releaseTimerRef.current) {
          clearTimeout(releaseTimerRef.current)
          releaseTimerRef.current = 0
        }
        dropTimeRef.current = 0
        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(renderRef.current)
      } else {
        if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current)
        releaseTimerRef.current = window.setTimeout(() => {
          release()
          releaseTimerRef.current = 0
        }, 4000)
      }
    },
  }), [ensureInited, release])

  useEffect(() => {
    const onResize = () => { if (isInitedRef.current) uploadImage() }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current)
        releaseTimerRef.current = 0
      }
      release()
    }
  }, [release, uploadImage])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <img
        ref={imgElRef}
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ visibility: ready ? 'visible' : 'hidden' }}
      />
    </div>
  )
})

RippleImage.displayName = 'RippleImage'
export default RippleImage
