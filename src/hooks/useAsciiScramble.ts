import { useState, useRef, useCallback } from 'react'

const GLITCH_CHARS = '█▓▒░╗╔╝╚║═╣╠╩╦╬▀▄▌▐■□▪▫●○◆◇'

export function useAsciiScramble(original: string, duration = 800) {
  const [display, setDisplay] = useState(original)
  const rafRef = useRef(0)
  const isRunning = useRef(false)

  const scramble = useCallback(() => {
    if (isRunning.current) return
    isRunning.current = true

    const chars = [...original]
    const totalFrames = Math.round(duration / 16)
    let frame = 0

    const tick = () => {
      frame++
      const progress = frame / totalFrames

      const result = chars.map((char, i) => {
        if (char === '\n' || char === ' ') return char
        const settleAt = (i / chars.length) * 0.7 + 0.3
        if (progress >= settleAt) return char
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      })

      setDisplay(result.join(''))

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(original)
        isRunning.current = false
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [original, duration])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    isRunning.current = false
    setDisplay(original)
  }, [original])

  return { display, scramble, reset }
}
