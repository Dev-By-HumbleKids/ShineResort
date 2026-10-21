import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Small shared "stage" for SHINE's stylised 3D scenes.
 * - renders on demand (only when the camera moves, the theme changes,
 *   or an animation is running) and pauses entirely when off-screen
 * - projects 3D hotspot anchors onto absolutely-positioned DOM buttons
 * - swaps a day / night lighting rig
 */
export type StageOptions = {
  camera: [number, number, number]
  target: [number, number, number]
  minDistance: number
  maxDistance: number
  fov?: number
}

export type Stage = ReturnType<typeof createStage>

const SKY = { day: new THREE.Color('#cfe4e2'), night: new THREE.Color('#081a20') }

export function createStage(container: HTMLElement, opts: StageOptions) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  container.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = SKY.day.clone()
  // soft studio reflections so water, glass and metal pick up highlights
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  scene.environmentIntensity = 0.35
  pmrem.dispose()
  scene.fog = new THREE.Fog(SKY.day.clone(), 55, 120)

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 35, 1, 0.1, 200)
  camera.position.set(...opts.camera)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(...opts.target)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.enableZoom = false // wheel stays for page scrolling; zoom via buttons
  controls.minDistance = opts.minDistance
  controls.maxDistance = opts.maxDistance
  controls.minPolarAngle = 0.35
  controls.maxPolarAngle = 1.28
  controls.rotateSpeed = 0.6
  const coarse = window.matchMedia('(pointer: coarse)').matches
  // On touch screens one-finger drags scroll the page; rotation uses buttons.
  if (coarse) {
    controls.enabled = false
    renderer.domElement.style.touchAction = 'pan-y'
  }

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight('#fff6e6', '#5f8f8a', 1.4)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight('#fff1d6', 2.6)
  sun.position.set(-14, 22, 10)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -22
  sun.shadow.camera.right = 22
  sun.shadow.camera.top = 22
  sun.shadow.camera.bottom = -22
  sun.shadow.bias = -0.0008
  scene.add(sun)

  const starGeo = new THREE.BufferGeometry()
  const starPos = new Float32Array(600 * 3)
  for (let i = 0; i < 600; i++) {
    const r = 80
    const th = Math.random() * Math.PI * 2
    const ph = Math.random() * Math.PI * 0.45
    starPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) + 5, r * Math.sin(ph) * Math.sin(th)], i * 3)
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#f6e7c4', size: 0.35, sizeAttenuation: true, fog: false }))
  stars.visible = false
  scene.add(stars)

  /** Objects that glow at night (windows, lanterns). */
  const nightLights: THREE.Light[] = []
  const glowMaterials: THREE.MeshStandardMaterial[] = []
  /** Extra per-scene hooks run when the theme flips. */
  const nightHooks: ((night: boolean) => void)[] = []

  function setNight(night: boolean) {
    const sky = night ? SKY.night : SKY.day
    ;(scene.background as THREE.Color).copy(sky)
    scene.fog!.color.copy(sky)
    hemi.intensity = night ? 0.35 : 1.4
    hemi.color.set(night ? '#7d9cc4' : '#fff6e6')
    sun.intensity = night ? 0.45 : 2.6
    sun.color.set(night ? '#9fb8e6' : '#fff1d6')
    sun.position.set(night ? 16 : -14, night ? 18 : 22, night ? -8 : 10)
    stars.visible = night
    renderer.toneMappingExposure = night ? 1.25 : 1.05
    nightLights.forEach((l) => (l.visible = night))
    glowMaterials.forEach((m) => (m.emissiveIntensity = night ? 2.2 : 0))
    scene.environmentIntensity = night ? 0.06 : 0.35
    nightHooks.forEach((fn) => fn(night))
    invalidate()
  }

  // ---------- hotspots ----------
  type Spot = { el: HTMLElement; pos: THREE.Vector3 }
  let spots: Spot[] = []
  const tmp = new THREE.Vector3()
  function bindHotspots(els: HTMLElement[], positions: Record<string, [number, number, number]>) {
    spots = els
      .map((el) => ({ el, pos: new THREE.Vector3(...(positions[el.dataset.spot ?? ''] ?? [0, 0, 0])) }))
      .filter((s) => s.el.dataset.spot && positions[s.el.dataset.spot])
    invalidate()
  }
  function updateHotspots(w: number, h: number) {
    for (const s of spots) {
      tmp.copy(s.pos).project(camera)
      const behind = tmp.z > 1
      const x = (tmp.x * 0.5 + 0.5) * w
      const y = (-tmp.y * 0.5 + 0.5) * h
      s.el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      s.el.style.opacity = behind ? '0' : '1'
    }
  }

  // ---------- loop ----------
  let needsRender = true
  let visible = true
  let raf = 0
  let running = false
  const animators = new Set<(t: number, dt: number) => void>()
  let size = { w: 1, h: 1 }
  let flight: { from: THREE.Vector3; to: THREE.Vector3; start: number; dur: number } | null = null
  const clock = new THREE.Clock()

  function invalidate() {
    needsRender = true
    start()
  }
  function start() {
    if (!running && visible) {
      running = true
      clock.getDelta()
      raf = requestAnimationFrame(tick)
    }
  }
  function tick() {
    raf = 0
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    let animating = false
    if (flight) {
      const p = Math.min(1, (performance.now() - flight.start) / flight.dur)
      const e = 1 - Math.pow(1 - p, 3)
      camera.position.lerpVectors(flight.from, flight.to, e)
      if (p >= 1) flight = null
      animating = true
    }
    if (!reduceMotion && animators.size) {
      animators.forEach((fn) => fn(t, dt))
      animating = true
    }
    const moved = controls.update()
    if (moved || needsRender || animating) {
      renderer.render(scene, camera)
      updateHotspots(size.w, size.h)
      needsRender = false
    }
    // keep looping only while something is changing
    if (visible && (animating || moved || needsRender)) {
      raf = requestAnimationFrame(tick)
    } else running = false
  }
  controls.addEventListener('change', invalidate)

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    size = { w, h }
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    invalidate()
  })
  ro.observe(container)

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && document.visibilityState === 'visible'
    if (visible) invalidate()
    else if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
      running = false
    }
  })
  io.observe(container)

  /** Orbit the camera around the target by an angle (radians) and/or dolly. */
  function nudge(angle: number, zoom = 1) {
    const offset = camera.position.clone().sub(controls.target)
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
    const len = THREE.MathUtils.clamp(offset.length() * zoom, controls.minDistance, controls.maxDistance)
    offset.setLength(len)
    flight = { from: camera.position.clone(), to: controls.target.clone().add(offset), start: performance.now(), dur: 700 }
    invalidate()
  }

  function introFlight(from: [number, number, number]) {
    if (reduceMotion) return
    const to = camera.position.clone()
    camera.position.set(...from)
    flight = { from: camera.position.clone(), to, start: performance.now(), dur: 2200 }
    invalidate()
  }

  function dispose() {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    controls.dispose()
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose?.()
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose?.()
    })
    envTex.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }

  return {
    scene,
    camera,
    controls,
    renderer,
    nightLights,
    glowMaterials,
    nightHooks,
    animators,
    setNight,
    bindHotspots,
    invalidate,
    nudge,
    introFlight,
    dispose,
    touch: coarse,
  }
}

// ---------- tiny modelling kit ----------
const matCache = new Map<string, THREE.MeshStandardMaterial>()
export function mat(color: string, opts: THREE.MeshStandardMaterialParameters = {}) {
  const key = color + JSON.stringify(opts)
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...opts })
    matCache.set(key, m)
  }
  return m
}
export function clearMatCache() {
  matCache.clear()
}

export function box(w: number, h: number, d: number, material: THREE.Material, pos: [number, number, number] = [0, 0, 0]) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  m.position.set(...pos)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

export function cyl(rt: number, rb: number, h: number, material: THREE.Material, pos: [number, number, number] = [0, 0, 0], seg = 8) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material)
  m.position.set(...pos)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Four-sided hip roof. */
export function hipRoof(w: number, d: number, h: number, material: THREE.Material) {
  const g = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1)
  g.rotateY(Math.PI / 4)
  const m = new THREE.Mesh(g, material)
  m.scale.set(w, h, d)
  m.castShadow = true
  return m
}

export function palm(height = 2.4, lean = 0.25) {
  const g = new THREE.Group()
  const trunkMat = mat('#8a6b4a')
  const leafMat = mat('#4f7a52', { side: THREE.DoubleSide })
  const segs = 4
  for (let i = 0; i < segs; i++) {
    const s = cyl(0.07 - i * 0.008, 0.09 - i * 0.008, height / segs, trunkMat, [lean * (i / segs) * height * 0.4, (i + 0.5) * (height / segs), 0], 6)
    g.add(s)
  }
  const top = new THREE.Vector3(lean * height * 0.4, height, 0)
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.2, 3), leafMat)
    leaf.castShadow = true
    leaf.position.copy(top)
    leaf.rotation.set(0, (i / 7) * Math.PI * 2, 0)
    leaf.rotateZ(-1.15)
    leaf.translateY(0.5)
    g.add(leaf)
  }
  return g
}

/** Irregular flat island blob, extruded. */
export function blob(radius: number, wobble: number, depth: number, material: THREE.Material, seed = 1, points = 28) {
  const shape = new THREE.Shape()
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2
    const r = radius * (1 + wobble * Math.sin(a * 3 + seed) * 0.5 + wobble * Math.cos(a * 5 + seed * 2) * 0.3)
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r * 0.78
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.5, bevelSegments: 2, curveSegments: 4 })
  g.rotateX(-Math.PI / 2)
  const m = new THREE.Mesh(g, material)
  m.receiveShadow = true
  return m
}

/** Gently animated low-poly water plane, lighter in the shallows near the centre. */
export function water(size: number, color: string, segments = 48, shallow = '#5fc4bf', shallowRadius = 16) {
  const g = new THREE.PlaneGeometry(size, size, segments, segments)
  g.rotateX(-Math.PI / 2)
  const deep = new THREE.Color(color)
  const light = new THREE.Color(shallow)
  const colors = new Float32Array(g.attributes.position.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < g.attributes.position.count; i++) {
    const d = Math.hypot(g.attributes.position.getX(i), g.attributes.position.getZ(i))
    c.copy(light).lerp(deep, THREE.MathUtils.smoothstep(d, shallowRadius * 0.55, shallowRadius * 1.6))
    colors.set([c.r, c.g, c.b], i * 3)
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.22, metalness: 0.05, flatShading: true, transparent: true, opacity: 0.95, envMapIntensity: 0.35 })
  const mesh = new THREE.Mesh(g, material)
  mesh.receiveShadow = true
  const pos = g.attributes.position as THREE.BufferAttribute
  const base = Float32Array.from(pos.array as Float32Array)
  const animate = (t: number) => {
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      const z = base[i * 3 + 2]
      pos.setY(i, Math.sin(x * 0.35 + t * 0.8) * 0.06 + Math.cos(z * 0.4 + t * 0.6) * 0.06)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
  }
  animate(0)
  return { mesh, animate }
}

/** Pulsing ring of surf around a shoreline blob. */
export function foam(stage: Stage, radius: number, wobble: number, seed: number, y = 0.02) {
  const m = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5, depthWrite: false })
  const ring = blob(radius, wobble, 0.01, m, seed)
  ring.position.y = y
  ring.receiveShadow = false
  ring.renderOrder = 1
  stage.scene.add(ring)
  stage.animators.add((t) => {
    const k = 1 + Math.sin(t * 0.9) * 0.012
    ring.scale.set(k, 1, k)
    m.opacity = 0.32 + Math.sin(t * 0.9 + 1) * 0.14
  })
  return ring
}

function glowTexture(inner: string, outer: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, inner)
  g.addColorStop(0.25, inner)
  g.addColorStop(0.32, outer)
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Sun by day, moon by night, and a few drifting low-poly clouds. */
export function atmosphere(stage: Stage, opts: { sun: [number, number, number]; moon: [number, number, number]; clouds?: number }) {
  const sunMat = new THREE.SpriteMaterial({ map: glowTexture('rgba(255,244,214,1)', 'rgba(255,196,120,0.35)'), depthWrite: false, fog: false, transparent: true })
  const sun = new THREE.Sprite(sunMat)
  sun.position.set(...opts.sun)
  sun.scale.setScalar(16)
  stage.scene.add(sun)
  const moonMat = new THREE.SpriteMaterial({ map: glowTexture('rgba(246,240,224,1)', 'rgba(170,196,236,0.25)'), depthWrite: false, fog: false, transparent: true })
  const moon = new THREE.Sprite(moonMat)
  moon.position.set(...opts.moon)
  moon.scale.setScalar(9)
  moon.visible = false
  stage.scene.add(moon)

  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: 0.92 })
  const clouds: THREE.Group[] = []
  for (let i = 0; i < (opts.clouds ?? 5); i++) {
    const g = new THREE.Group()
    const puffs = 3 + (i % 3)
    for (let j = 0; j < puffs; j++) {
      const p = new THREE.Mesh(new THREE.IcosahedronGeometry(1 + ((i + j) % 3) * 0.45, 0), cloudMat)
      p.position.set(j * 1.4 - puffs * 0.6, Math.sin(j * 2.1) * 0.35, Math.cos(j * 1.3) * 0.6)
      p.scale.y = 0.65
      g.add(p)
    }
    g.position.set(-50 + i * 21, 7 + (i % 3) * 2.2, -42 - ((i * 17) % 26))
    g.scale.setScalar(1.3)
    g.userData.speed = 0.35 + (i % 3) * 0.15
    clouds.push(g)
    stage.scene.add(g)
  }
  stage.animators.add((_t, dt) => {
    for (const c of clouds) {
      c.position.x += c.userData.speed * dt
      if (c.position.x > 55) c.position.x = -55
    }
  })
  // gradient sky dome: warm horizon fading to blue (day) or ink (night)
  const domeGeo = new THREE.SphereGeometry(110, 32, 16)
  const domeColors = new Float32Array(domeGeo.attributes.position.count * 3)
  domeGeo.setAttribute('color', new THREE.BufferAttribute(domeColors, 3))
  const dome = new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }))
  dome.renderOrder = -1
  stage.scene.add(dome)
  const paintSky = (horizon: string, zenith: string) => {
    const h = new THREE.Color(horizon)
    const z = new THREE.Color(zenith)
    const c = new THREE.Color()
    const pos = domeGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp(pos.getY(i) / 110, 0, 1)
      c.copy(h).lerp(z, Math.pow(t, 0.55))
      domeColors.set([c.r, c.g, c.b], i * 3)
    }
    domeGeo.attributes.color.needsUpdate = true
    stage.scene.fog?.color.set(horizon)
  }

  stage.nightHooks.push((night) => {
    paintSky(night ? '#1c3a47' : '#f1e3c8', night ? '#040d12' : '#8fc3cc')
    sun.visible = !night
    moon.visible = night
    cloudMat.color.set(night ? '#3a5563' : '#ffffff')
    cloudMat.opacity = night ? 0.55 : 0.92
  })
}

/** A small sailing boat circling offshore. */
export function sailboat(stage: Stage, radius: number, speed = 0.05, y = 0.12) {
  const b = new THREE.Group()
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.12, 1.8, 6, 1, false, 0, Math.PI), mat('#f7f4ed'))
  hull.rotation.set(Math.PI / 2, 0, Math.PI / 2)
  hull.castShadow = true
  b.add(hull)
  b.add(cyl(0.025, 0.025, 1.9, mat('#6b4f36'), [0.1, 0.95, 0], 5))
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, 1.7)
  shape.lineTo(0.95, 0)
  shape.lineTo(0, 0)
  const sail = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat('#fffaf0', { side: THREE.DoubleSide, flatShading: false }))
  sail.position.set(0.12, 0.15, 0)
  sail.castShadow = true
  b.add(sail)
  stage.scene.add(b)
  stage.animators.add((t) => {
    const a = t * speed
    b.position.set(Math.cos(a) * radius, y + Math.sin(t * 1.6) * 0.04, Math.sin(a) * radius * 0.8)
    b.rotation.y = -a - Math.PI / 2
    b.rotation.z = Math.sin(t * 1.3) * 0.05
  })
  return b
}
