import { useEffect, useState } from 'react'

interface AsciiImageProps {
  src: string
  width?: number
  className?: string
}

// Characters from dark to light
const ASCII_CHARS = ' .·:;+*#%@$&WMHB'

export default function AsciiImage({ src, width = 150, className }: AsciiImageProps) {
  const [ascii, setAscii] = useState('')

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const aspect = img.height / img.width
      const cols = width
      const rows = Math.round(cols * aspect * 0.45) // 0.45 compensates for character aspect ratio

      const canvas = document.createElement('canvas')
      canvas.width = cols
      canvas.height = rows
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, cols, rows)
      const data = ctx.getImageData(0, 0, cols, rows).data

      let result = ''
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          const charIndex = Math.floor(brightness * (ASCII_CHARS.length - 1))
          result += ASCII_CHARS[charIndex]
        }
        result += '\n'
      }
      setAscii(result)
    }
    img.src = src
  }, [src, width])

  if (!ascii) return null

  return (
    <pre
      className={`select-none leading-[1.1] text-text-primary ${className ?? ''}`}
      style={{
        fontFamily: 'monospace',
        fontSize: 'clamp(3px, 0.45vw, 6px)',
        letterSpacing: '0.05em',
        whiteSpace: 'pre',
        overflow: 'hidden',
      }}
    >
      {ascii}
    </pre>
  )
}
