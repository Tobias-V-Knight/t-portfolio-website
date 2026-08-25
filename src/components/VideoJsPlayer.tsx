import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// A Video.js player, mounted the React way and StrictMode-safe: each effect run
// creates a fresh <video-js> element and disposes it on cleanup, so React's
// double-invoke in dev cannot leave a half-initialised player behind. Autoplay
// works because it is muted; controls let you actually play/scrub it.
export function VideoJsPlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const videoEl = document.createElement('video-js')
    videoEl.classList.add('vjs-big-play-centered')
    container.appendChild(videoEl)

    const player = videojs(videoEl, {
      autoplay: true,
      loop: true,
      muted: true,
      controls: true,
      preload: 'auto',
      fill: true,
      playsinline: true,
      sources: [{ src, type: 'video/mp4' }],
    })

    return () => {
      try {
        player.dispose()
      } catch {
        // Disposing an already-torn-down player throws; nothing to do.
      }
    }
  }, [src])

  return <div ref={containerRef} data-vjs-player className="mac-vjs" />
}
