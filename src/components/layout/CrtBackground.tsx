import { useState, useRef, useEffect, createContext, useContext } from 'react'

// Context to share video state with toggle button
const CrtContext = createContext<{
  enabled: boolean
  toggle: () => void
}>({ enabled: true, toggle: () => {} })

export function useCrt() {
  return useContext(CrtContext)
}

const CRT_VIDEOS = [
  '/videos/11724415-uhd_1440_2018_60fps.mp4',
  '/videos/6976215-uhd_2160_2880_25fps.mp4',
]

export function CrtProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem('slug-crt')
    return stored !== 'off'
  })

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem('slug-crt', next ? 'on' : 'off')
      return next
    })
  }

  return (
    <CrtContext.Provider value={{ enabled, toggle }}>
      {children}
    </CrtContext.Provider>
  )
}

export default function CrtBackground() {
  const { enabled, toggle } = useCrt()
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % CRT_VIDEOS.length)
  }

  useEffect(() => {
    if (enabled) {
      videoRef.current?.play().catch(() => {})
    } else {
      videoRef.current?.pause()
    }
  }, [currentIndex, enabled])

  return (
    <div
      className="fixed top-0 right-0 bottom-0 z-10 overflow-hidden hidden xl:block"
      style={{ left: 'var(--container-max)' }}
    >
      {/* Toggle button */}
      <button
        onClick={toggle}
        className="absolute top-4 right-4 z-20 cursor-pointer rounded bg-black/50 px-3 py-1.5 text-[0.625rem] uppercase tracking-widest text-white/50 backdrop-blur-sm transition hover:text-white/80"
      >
        CRT {enabled ? 'ON' : 'OFF'}
      </button>

      {!enabled ? null : (
        <>
      <video
        ref={videoRef}
        key={currentIndex}
        src={CRT_VIDEOS[currentIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.2) contrast(1.2)' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)',
          backgroundSize: '100% 4px',
        }}
      />

      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.06)',
          animation: 'crt-scanline 8s linear infinite',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          animation: 'crt-noise 0.08s steps(5) infinite',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background: 'linear-gradient(180deg, rgba(0,255,70,0.04) 0%, rgba(0,255,70,0.08) 50%, rgba(0,255,70,0.04) 100%)',
          animation: 'crt-flicker 2s ease-in-out infinite',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      </>
      )}
    </div>
  )
}
