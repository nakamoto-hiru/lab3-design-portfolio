import { useEffect } from 'react'

const THEME_KEY = 'slug-theme'

function getImageBrightness(src: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(0)
      canvas.width = 50
      canvas.height = 50
      ctx.drawImage(img, 0, 0, 50, 50)
      const data = ctx.getImageData(0, 0, 50, 50).data
      let sum = 0
      for (let i = 0; i < data.length; i += 4) {
        sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      }
      resolve(sum / (50 * 50))
    }
    img.onerror = () => resolve(0)
    img.src = src
  })
}

function restoreUserTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  const html = document.documentElement
  if (stored === 'light') {
    html.setAttribute('data-theme', 'light')
  } else if (stored === 'mono') {
    html.setAttribute('data-theme', 'mono')
  } else {
    html.removeAttribute('data-theme')
  }
}

export function useImageTheme(src?: string) {
  useEffect(() => {
    if (!src) return
    getImageBrightness(src).then((brightness) => {
      const theme = brightness > 140 ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', theme)
    })
    return () => {
      restoreUserTheme()
    }
  }, [src])
}
