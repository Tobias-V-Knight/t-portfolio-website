// The iMac G3, in three dimensions.
//
// Why this exists: the SVG version was rejected, correctly. Flat vector art
// cannot produce the thing that makes translucent plastic read as plastic,
// which is light passing THROUGH it and a room reflecting off it. Those are
// physical effects, and faking them by hand always looks like a drawing of a
// computer rather than a computer.
//
// Three ingredients do the work here, in order of how much they matter:
//
//   1. The environment map. Every highlight you read as real is a room being
//      reflected. three ships RoomEnvironment, which builds a studio
//      procedurally, so this costs zero download rather than a 1MB HDRI.
//   2. Transmission. MeshPhysicalMaterial with transmission, thickness and an
//      index of refraction actually refracts what is behind it.
//   3. Geometry that is close enough. It is built from a silhouette in code,
//      so there is no model file, no licence, and nothing to download. If the
//      shape is not convincing enough it can be swapped for a GLTF later
//      without touching anything else in this file.
//
// The screen is not a texture. It is real DOM, positioned in 3D by
// CSS3DRenderer and aligned to the screen plane, so the boot log inside it is
// real text in the real font with real elements, and stays selectable.

import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// Screen size in world units, and the pixel size of the DOM that sits on it.
// The ratio between them is the CSS3D scale factor, and getting it wrong is
// the difference between a crisp screen and a blurry one.
const SCREEN_W = 3.15
const SCREEN_H = 2.36
const SCREEN_PX_W = 760
const SCREEN_PX_H = 570

export interface ImacScene {
  enter: (onArrive: () => void) => void
  dispose: () => void
}

// The front silhouette. Domed top, bulged flanks, a waist under the chin, and
// a splayed foot, which together are most of what makes a G3 recognisable.
function bodyShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 2.55)
  s.bezierCurveTo(1.55, 2.55, 2.15, 1.95, 2.15, 0.95)
  s.lineTo(2.15, -0.35)
  s.bezierCurveTo(2.15, -1.15, 1.75, -1.6, 1.2, -1.82)
  s.bezierCurveTo(0.95, -1.94, 0.86, -2.12, 0.86, -2.32)
  s.bezierCurveTo(0.86, -2.6, 1.06, -2.8, 1.28, -2.92)
  s.lineTo(-1.28, -2.92)
  s.bezierCurveTo(-1.06, -2.8, -0.86, -2.6, -0.86, -2.32)
  s.bezierCurveTo(-0.86, -2.12, -0.95, -1.94, -1.2, -1.82)
  s.bezierCurveTo(-1.75, -1.6, -2.15, -1.15, -2.15, -0.35)
  s.lineTo(-2.15, 0.95)
  s.bezierCurveTo(-2.15, 1.95, -1.55, 2.55, 0, 2.55)
  return s
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  return s
}

// An extrusion is a slab, and the G3 was a teardrop: deep and full at the
// front, tapering away behind the tube. Tapering the vertices by depth turns
// one into the other without needing a modelled mesh.
function taperByDepth(geo: THREE.BufferGeometry, front: number, back: number, amount: number) {
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i)
    const t = THREE.MathUtils.clamp((front - z) / (front - back), 0, 1)
    const k = 1 - amount * t * t
    pos.setX(i, pos.getX(i) * k)
    // The foot stays planted, so the taper pivots around the base rather than
    // the centre, which would lift the machine off the desk.
    pos.setY(i, (pos.getY(i) + 2.92) * k - 2.92)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function contactShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 124)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(0.55, 'rgba(0,0,0,0.22)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

export function createImacScene(host: HTMLElement, screenEl: HTMLElement): ImacScene {
  const isSmall = window.innerWidth <= 768
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.1, 100)
  camera.position.set(0, 0.15, isSmall ? 19.5 : 15.6)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(host.clientWidth, host.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.domElement.className = 'mac-landing-canvas'
  host.appendChild(renderer.domElement)

  const cssRenderer = new CSS3DRenderer()
  cssRenderer.setSize(host.clientWidth, host.clientHeight)
  cssRenderer.domElement.className = 'mac-landing-css'
  host.appendChild(cssRenderer.domElement)

  // The room. This is the realism, and it weighs nothing.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture

  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-4.5, 5.5, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xbfd0ff, 0.9)
  rim.position.set(5, 2, -4)
  scene.add(rim)

  const imac = new THREE.Group()
  scene.add(imac)

  // --- Shell -------------------------------------------------------------
  const shellGeo = new THREE.ExtrudeGeometry(bodyShape(), {
    depth: 2.5,
    bevelEnabled: true,
    bevelThickness: 0.42,
    bevelSize: 0.42,
    bevelSegments: 10,
    curveSegments: 48,
  })
  shellGeo.translate(0, 0, -1.25)
  taperByDepth(shellGeo, 1.25, -1.9, 0.34)

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0x707ae4,
    metalness: 0,
    roughness: 0.14,
    // Transmission is the expensive one. On a phone it halves the frame rate
    // for an effect nobody sees at that size, so it comes down rather than off.
    transmission: isSmall ? 0.4 : 0.94,
    thickness: 1.5,
    ior: 1.48,
    attenuationColor: new THREE.Color(0x3a41a8),
    attenuationDistance: 6.5,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.35,
    transparent: true,
  })
  const shell = new THREE.Mesh(shellGeo, shellMat)
  imac.add(shell)

  // Something solid inside, so the translucency has something to be
  // translucent about. An empty shell just looks like tinted glass.
  const gutsMat = new THREE.MeshStandardMaterial({ color: 0x23265e, roughness: 0.65 })
  const guts = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.2, 1.3), gutsMat)
  guts.position.set(0, 0.15, -0.75)
  imac.add(guts)

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 1.6), gutsMat)
  chassis.position.set(0, -1.55, -0.45)
  imac.add(chassis)

  // --- Bezel and screen --------------------------------------------------
  const bezelGeo = new THREE.ExtrudeGeometry(roundedRect(3.86, 3.34, 0.42), {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.16,
    bevelSegments: 6,
    curveSegments: 32,
  })
  const bezel = new THREE.Mesh(
    bezelGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xf1efe9,
      roughness: 0.38,
      clearcoat: 0.7,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.9,
    }),
  )
  bezel.position.set(0, 0.52, 1.12)
  imac.add(bezel)

  // The tube well, recessed into the bezel.
  const wellGeo = new THREE.ExtrudeGeometry(roundedRect(SCREEN_W + 0.3, SCREEN_H + 0.3, 0.22), {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 4,
    curveSegments: 20,
  })
  const well = new THREE.Mesh(
    wellGeo,
    new THREE.MeshStandardMaterial({ color: 0x13171b, roughness: 0.45 }),
  )
  well.position.set(0, 0.78, 1.66)
  imac.add(well)

  // Curved glass in front of the DOM screen. Very slightly reflective, which
  // is what stops the CSS3D layer from looking pasted on.
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(SCREEN_W + 0.1, SCREEN_H + 0.1, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.06,
      transmission: 1,
      thickness: 0.25,
      ior: 1.52,
      transparent: true,
      opacity: 0.5,
    }),
  )
  // Bow the glass out very slightly, the way a tube did.
  {
    const p = glass.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / (SCREEN_W / 2)
      const y = p.getY(i) / (SCREEN_H / 2)
      p.setZ(i, (1 - x * x) * (1 - y * y) * 0.09)
    }
    p.needsUpdate = true
    glass.geometry.computeVertexNormals()
  }
  glass.position.set(0, 0.78, 1.9)
  imac.add(glass)

  // The screen contents: real DOM, in 3D.
  const css = new CSS3DObject(screenEl)
  css.scale.setScalar(SCREEN_W / SCREEN_PX_W)
  css.position.set(0, 0.78, 1.86)
  imac.add(css)

  // --- Chin furniture ----------------------------------------------------
  const drive = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.09, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xbdbab4, roughness: 0.6 }),
  )
  drive.position.set(0, -0.62, 1.73)
  imac.add(drive)

  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x9ef0a8, emissive: 0x4bd463, emissiveIntensity: 2 }),
  )
  led.position.set(1.5, -0.62, 1.73)
  imac.add(led)

  // The dimple where the logo sat. Small, and the kind of detail that is only
  // noticed when it is missing.
  const dimple = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 24),
    new THREE.MeshStandardMaterial({ color: 0xdedbd5, roughness: 0.55 }),
  )
  dimple.position.set(-1.5, -0.62, 1.73)
  imac.add(dimple)

  // --- Ground and shadow -------------------------------------------------
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshBasicMaterial({
      map: contactShadowTexture(),
      transparent: true,
      depthWrite: false,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.set(0, -2.95, 0.2)
  scene.add(shadow)

  imac.position.y = 0.25

  // --- Interaction -------------------------------------------------------
  // A few degrees of follow, no more. This is a heavy object on a desk, and
  // anything that swings it far reads as a sticker floating over the page.
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let entering = false
  let arrived: (() => void) | null = null
  let progress = 0

  function onPointer(e: PointerEvent) {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer)

  const startPos = camera.position.clone()
  const endPos = new THREE.Vector3(0, 1.03, 2.5)

  let raf = 0
  let last = performance.now()

  function tick(now: number) {
    raf = requestAnimationFrame(tick)
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now

    current.x += (target.x - current.x) * Math.min(1, dt * 3.4)
    current.y += (target.y - current.y) * Math.min(1, dt * 3.4)
    imac.rotation.y = -current.x * 0.16
    imac.rotation.x = current.y * 0.09

    if (entering) {
      progress = Math.min(1, progress + dt * 0.85)
      // Ease out cubic, so the push in decelerates into the glass rather than
      // slamming into it.
      const e = 1 - Math.pow(1 - progress, 3)
      camera.position.lerpVectors(startPos, endPos, e)
      camera.lookAt(0, 1.03, 1.6)
      host.style.setProperty('--enter', String(e))
      if (progress >= 1 && arrived) {
        const done = arrived
        arrived = null
        done()
      }
    }

    renderer.render(scene, camera)
    cssRenderer.render(scene, camera)
  }
  tick(last)

  function onResize() {
    camera.aspect = host.clientWidth / host.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(host.clientWidth, host.clientHeight)
    cssRenderer.setSize(host.clientWidth, host.clientHeight)
  }
  window.addEventListener('resize', onResize)

  return {
    enter(onArrive) {
      if (entering) return
      entering = true
      arrived = onArrive
    },
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      envRT.dispose()
      pmrem.dispose()
      renderer.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
      })
      renderer.domElement.remove()
      cssRenderer.domElement.remove()
    },
  }
}

export const SCREEN_PIXELS = { w: SCREEN_PX_W, h: SCREEN_PX_H }
