import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
  scene.fog = new THREE.Fog(SKY.day.clone(), 40, 90)

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

/** Gently animated low-poly water plane. */
export function water(size: number, color: string, segments = 48) {
  const g = new THREE.PlaneGeometry(size, size, segments, segments)
  g.rotateX(-Math.PI / 2)
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.1, flatShading: true, transparent: true, opacity: 0.92 })
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
