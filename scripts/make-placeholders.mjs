// Generates the placeholder JPEGs that stand in for T's real photographs.
//
// These are not grey boxes. Spec section 9 asks for mixed resolutions,
// deliberate compression and slightly awkward old camera aspect ratios, so the
// placeholders carry that too: every one gets its own size, its own two tone
// palette and a 4x4 ordered dither, which is exactly what a 1990s image looked
// like once it had been through a palette reduction.
//
// Written as uncompressed BMP and handed to sips for JPEG encoding, because
// macOS already ships an encoder and this does not deserve a dependency.
//
// Run: node scripts/make-placeholders.mjs
// Overwrites public/photos/*.JPG. Delete this script the day real photos land.

import { writeFileSync, unlinkSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const OUT = 'public/photos'
mkdirSync(OUT, { recursive: true })

// Sizes vary on purpose. Uniform dimensions read as a template.
const shots = [
  { file: 'HOMELAB_003.JPG', w: 640, h: 480, a: [58, 62, 78], b: [176, 172, 160], q: 55 },
  { file: 'IMG_0837.JPG', w: 800, h: 600, a: [92, 104, 84], b: [222, 214, 186], q: 72 },
  { file: 'ZIPPER_01.JPG', w: 720, h: 540, a: [96, 74, 58], b: [226, 208, 184], q: 80 },
  { file: 'MAC_MINI_ARR.JPG', w: 512, h: 384, a: [70, 70, 76], b: [198, 198, 196], q: 48 },
  { file: 'PICKLEBALL_2026.JPG', w: 640, h: 426, a: [46, 82, 96], b: [214, 220, 206], q: 66 },
  { file: 'STILLWATER_LOOP.JPG', w: 800, h: 534, a: [64, 78, 96], b: [230, 224, 208], q: 74 },
  { file: 'CELLAR_02.JPG', w: 480, h: 640, a: [78, 44, 52], b: [204, 182, 168], q: 58 },
  { file: 'DESK_2026.JPG', w: 700, h: 466, a: [60, 58, 64], b: [212, 208, 198], q: 62 },
]

// Standard 4x4 Bayer matrix. Values 0 to 15, compared against the pixel's
// position in the gradient to decide which of the two tones it takes.
const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

function render({ w, h, a, b }, seed) {
  // Rows are bottom up and every row pads to a 4 byte boundary. Getting either
  // wrong produces a sheared image rather than an error, so it is worth saying.
  const pad = (4 - ((w * 3) % 4)) % 4
  const rowBytes = w * 3 + pad
  const pixels = Buffer.alloc(rowBytes * h)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // A soft diagonal gradient with a low frequency wave, so each image has
      // some structure rather than reading as a flat ramp.
      const nx = x / w
      const ny = y / h
      const wave = Math.sin((nx * 3 + seed) * Math.PI) * 0.16 + Math.cos((ny * 2 + seed) * Math.PI) * 0.12
      const level = Math.min(1, Math.max(0, nx * 0.45 + ny * 0.45 + wave))

      const threshold = (bayer[y % 4][x % 4] + 0.5) / 16
      const on = level > threshold
      const [r, g, bl] = on ? b : a

      const off = (h - 1 - y) * rowBytes + x * 3
      pixels[off] = bl
      pixels[off + 1] = g
      pixels[off + 2] = r
    }
  }

  const fileHeader = Buffer.alloc(14)
  const dib = Buffer.alloc(40)
  const size = 54 + pixels.length
  fileHeader.write('BM', 0)
  fileHeader.writeUInt32LE(size, 2)
  fileHeader.writeUInt32LE(54, 10)
  dib.writeUInt32LE(40, 0)
  dib.writeInt32LE(w, 4)
  dib.writeInt32LE(h, 8)
  dib.writeUInt16LE(1, 12)
  dib.writeUInt16LE(24, 14)
  dib.writeUInt32LE(pixels.length, 20)
  return Buffer.concat([fileHeader, dib, pixels])
}

shots.forEach((shot, i) => {
  const bmp = join(OUT, `${shot.file}.bmp`)
  const jpg = join(OUT, shot.file)
  writeFileSync(bmp, render(shot, i * 0.37))
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(shot.q), bmp, '--out', jpg], {
    stdio: 'ignore',
  })
  unlinkSync(bmp)
  console.log(`  ${shot.file}  ${shot.w}x${shot.h}`)
})

console.log(`\n${shots.length} placeholders written to ${OUT}`)
