import { useState, useEffect, useRef, useCallback } from 'react'
import figlet from 'figlet'
// @ts-expect-error — figlet font import
import ansiShadow from 'figlet/importable-fonts/ANSI Shadow'

// Register font once
figlet.parseFont('ANSI Shadow', ansiShadow)

interface AsciiTitleProps {
  text: string
  className?: string
}

export default function AsciiTitle({ text, className }: AsciiTitleProps) {
  const [ascii, setAscii] = useState('')
  const [scale, setScale] = useState(1)
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined)
  const preRef = useRef<HTMLPreElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Generate ASCII art
  useEffect(() => {
    figlet.text(text, { font: 'ANSI Shadow' }, (_err, result) => {
      if (result) setAscii(result)
    })
  }, [text])

  // Scale to fill container width
  const fitToWidth = useCallback(() => {
    if (preRef.current && wrapperRef.current) {
      const containerW = wrapperRef.current.offsetWidth
      const textW = preRef.current.scrollWidth
      const textH = preRef.current.scrollHeight
      if (textW > 0) {
        const s = containerW / textW
        setScale(s)
        setScaledHeight(textH * s)
      }
    }
  }, [])

  useEffect(() => {
    fitToWidth()
    document.fonts.ready.then(fitToWidth)
    window.addEventListener('resize', fitToWidth)
    return () => window.removeEventListener('resize', fitToWidth)
  }, [fitToWidth, ascii])

  if (!ascii) return null

  return (
    <div
      ref={wrapperRef as React.RefObject<HTMLDivElement>}
      className={`w-full overflow-hidden ${className ?? ''}`}
      style={{ height: scaledHeight }}
    >
      <pre
        ref={preRef as React.RefObject<HTMLPreElement>}
        className="select-none leading-[1.15] text-text-primary"
        style={{
          fontFamily: 'monospace',
          fontSize: '1rem',
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          whiteSpace: 'pre',
          width: 'fit-content',
        }}
      >{ascii}</pre>
    </div>
  )
}
