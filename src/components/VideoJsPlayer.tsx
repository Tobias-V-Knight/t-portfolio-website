import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// A Video.js player, mounted the React way and StrictMode-safe: each effect run
// creates a fresh <video-js> element and disposes it on cleanup, so React's
// double-invoke in dev cannot leave a half-initialised player behind. Autoplay
// works because it is muted; controls let you actually play/scrub it.
//
// It plays a playlist, not a single clip. Video.js core ships no playlist, so
// the cycle is hand rolled: when a clip ends we swap the source to the next
// entry and play it, wrapping back to the first so the sequence repeats
// forever. Adding a clip is one entry in `moviePlaylist` and nothing in here
// changes. The black and white treatment is CSS on `.vjs-tech`, and the tech
// element survives a source swap, so it holds across the whole loop.
export function VideoJsPlayer({ sources }: { sources: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // The effect keys off the joined list rather than the array identity. A
  // caller that builds the array inline would otherwise hand us a new object
  // on every render, tearing the player down and rebuilding it mid playback.
  const playlistKey = sources.join('|')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const clips = playlistKey.split('|').filter(Boolean)
    if (clips.length === 0) return

    const url = (clip: string) => `${import.meta.env.BASE_URL}${clip}`

    const videoEl = document.createElement('video-js')
    videoEl.classList.add('vjs-big-play-centered')
    container.appendChild(videoEl)

    const player = videojs(videoEl, {
      autoplay: true,
      // A one clip playlist loops in the tech, which is seamless and costs no
      // reload. Two or more and the 'ended' handler below does the cycling,
      // which needs 'ended' to actually fire, so loop has to be off.
      loop: clips.length === 1,
      muted: true,
      controls: true,
      preload: 'auto',
      fill: true,
      playsinline: true,
      sources: [{ src: url(clips[0]), type: 'video/mp4' }],
    })

    let index = 0
    let disposed = false

    const playNext = () => {
      // Cleanup runs before dispose finishes flushing events, and the play
      // promise below can settle after the window is closed. Both would touch
      // a dead player, so every path checks this first.
      if (disposed) return
      index = (index + 1) % clips.length
      player.src({ src: url(clips[index]), type: 'video/mp4' })
      // play() rejects when the browser blocks playback or when the player has
      // gone away between the swap and the call. Neither deserves a console
      // error in a window that is scenery.
      player.play()?.catch(() => {})
    }

    player.on('ended', playNext)

    return () => {
      disposed = true
      try {
        player.dispose()
      } catch {
        // Disposing an already-torn-down player throws; nothing to do.
      }
    }
  }, [playlistKey])

  return <div ref={containerRef} data-vjs-player className="mac-vjs" />
}
