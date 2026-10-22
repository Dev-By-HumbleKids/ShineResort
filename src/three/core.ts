import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

/**
 * Shared "stage" for SHINE's 3D scenes.
 * - physically-based sky by day (also used as the reflection environment),
 *   a starry gradient dome and moon by night
 * - soft shadows, ACES tone mapping and a gentle bloom so lanterns glow
 * - renders on demand and pauses entirely when off-screen
 * - projects 3D hotspot anchors onto absolutely-positioned DOM buttons
 */
export type StageOptions = {
  camera: [number, number, number]
  target: [number, number, number]
  minDistance: number
  maxDistance: number
  fov?: number
  /** direction the sun shines *from* by day */
  sun?: [number, number, number]
}

export type Stage = ReturnType<typeof createStage>

const HORIZON = { day: new THREE.Color('#dcebea'), night: new THREE.Color('#0b2129') }

export function createStage(container: HTMLElement, opts: StageOptions) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  const dpr = Math.min(window.devicePixelRatio, 1.75)
  renderer.setPixelRatio(dpr)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.62
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  container.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(HORIZON.day.clone(), 70, 190)

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 35, 1, 0.1, 2000)
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
  controls.maxPolarAngle = 1.32
  controls.rotateSpeed = 0.6
  const coarse = window.matchMedia('(pointer: coarse)').matches
  // On touch screens one-finger drags scroll the page; rotation uses buttons.
  if (coarse) {
    controls.enabled = false
    renderer.domElement.style.touchAction = 'pan-y'
  }

  // ---------- sky & environment ----------
  const sunDirDay = new THREE.Vector3(...(opts.sun ?? [-0.55, 0.42, 0.72])).normalize()
  const moonDir = new THREE.Vector3(0.45, 0.55, -0.7).normalize()

  const sky = new Sky()
  sky.scale.setScalar(1000)
  const su = sky.material.uniforms
  su.turbidity.value = 2.8
  su.rayleigh.value = 2.6
  su.mieCoefficient.value = 0.005
  su.mieDirectionalG.value = 0.82
  su.sunPosition.value.copy(sunDirDay)
  scene.add(sky)

  // night: ink-blue gradient dome, stars and a moon
  const domeGeo = new THREE.SphereGeometry(900, 32, 16)
  const domeCols = new Float32Array(domeGeo.attributes.position.count * 3)
  const h = new THREE.Color('#123a47')
  const z = new THREE.Color('#02080c')
  const c = new THREE.Color()
  for (let i = 0; i < domeGeo.attributes.position.count; i++) {
    const t = THREE.MathUtils.clamp(domeGeo.attributes.position.getY(i) / 900, 0, 1)
    c.copy(h).lerp(z, Math.pow(t, 0.45))
    domeCols.set([c.r, c.g, c.b], i * 3)
  }
  domeGeo.setAttribute('color', new THREE.BufferAttribute(domeCols, 3))
  const dome = new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }))
  dome.visible = false
  scene.add(dome)

  const starGeo = new THREE.BufferGeometry()
  const starPos = new Float32Array(1400 * 3)
  for (let i = 0; i < 1400; i++) {
    const r = 800
    const th = Math.random() * Math.PI * 2
    const ph = Math.random() * Math.PI * 0.47
    starPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3)
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#fff4dc', size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9 }))
  stars.visible = false
  scene.add(stars)

  const moon = new THREE.Mesh(new THREE.SphereGeometry(14, 32, 16), new THREE.MeshBasicMaterial({ color: '#f4efe0', fog: false }))
  moon.position.copy(moonDir).multiplyScalar(700)
  moon.visible = false
  scene.add(moon)

  // reflection environments rendered once from the sky itself
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new THREE.Scene()
  const envSky = new Sky()
  envSky.scale.setScalar(1000)
  Object.assign(envSky.material.uniforms, THREE.UniformsUtils.clone(sky.material.uniforms))
  envSky.material.uniforms.sunPosition.value.copy(sunDirDay)
  envScene.add(envSky)
  const envDay = pmrem.fromScene(envScene).texture
  const nightEnvScene = new THREE.Scene()
  nightEnvScene.add(new THREE.Mesh(domeGeo, dome.material))
  const envNight = pmrem.fromScene(nightEnvScene).texture
  pmrem.dispose()
  scene.environment = envDay

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight('#eaf4ff', '#b49a73', 0.4)
  scene.add(hemi)
  const sun = new THREE.DirectionalLight('#ffe8c4', 2.6)
  sun.position.copy(sunDirDay).multiplyScalar(40)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  const sc = sun.shadow.camera
  sc.left = -24
  sc.right = 24
  sc.top = 24
  sc.bottom = -24
  sc.near = 1
  sc.far = 120
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  sun.shadow.radius = 3
  scene.add(sun)

  /** Objects that glow at night (windows, lanterns). */
  const nightLights: THREE.Light[] = []
  const glowMaterials: THREE.MeshStandardMaterial[] = []
  /** Extra per-scene hooks run when the theme flips. */
  const nightHooks: ((night: boolean, lightDir: THREE.Vector3) => void)[] = []

  // ---------- post-processing ----------
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.15, 0.55, 0.88)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  let isNight = false
  function setNight(night: boolean) {
    isNight = night
    sky.visible = !night
    dome.visible = night
    stars.visible = night
    moon.visible = night
    scene.environment = night ? envNight : envDay
    scene.environmentIntensity = night ? 0.45 : 0.6
    scene.fog!.color.copy(night ? HORIZON.night : HORIZON.day)
    hemi.color.set(night ? '#6f8fbf' : '#eaf4ff')
    hemi.groundColor.set(night ? '#1d2a2e' : '#b49a73')
    hemi.intensity = night ? 0.25 : 0.4
    const dir = night ? moonDir : sunDirDay
    sun.position.copy(dir).multiplyScalar(40)
    sun.color.set(night ? '#9db6e8' : '#ffe8c4')
    sun.intensity = night ? 0.55 : 2.6
    renderer.toneMappingExposure = night ? 1.05 : 0.62
    bloom.strength = night ? 0.85 : 0.12
    bloom.threshold = night ? 0.62 : 0.9
    nightLights.forEach((l) => (l.visible = night))
    glowMaterials.forEach((m) => (m.emissiveIntensity = night ? 2.6 * ((m.userData.glow as number) ?? 1) : 0))
    nightHooks.forEach((fn) => fn(night, dir))
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
      composer.render()
      updateHotspots(size.w, size.h)
      needsRender = false
    }
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
    composer.setPixelRatio(dpr)
    composer.setSize(w, h)
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
    envDay.dispose()
    envNight.dispose()
    composer.dispose()
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
    sunDir: sunDirDay,
    get night() {
      return isNight
    },
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
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...opts })
    matCache.set(key, m)
  }
  return m
}
export function clearMatCache() {
  matCache.clear()
}

export function cyl(rt: number, rb: number, h: number, material: THREE.Material, pos: [number, number, number] = [0, 0, 0], seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material)
  m.position.set(...pos)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Smooth irregular land blob — same outline formula as the water shader uses. */
export function blob(radius: number, wobble: number, depth: number, material: THREE.Material, seed = 1, points = 96) {
  const shape = new THREE.Shape()
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2
    const r = radius * (1 + wobble * Math.sin(a * 3 + seed) * 0.5 + wobble * Math.cos(a * 5 + seed * 2) * 0.3)
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r * 0.78
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.5, bevelSegments: 6, curveSegments: 8 })
  g.rotateX(-Math.PI / 2)
  // world-space UVs so textures tile evenly across the top surface
  const p = g.attributes.position as THREE.BufferAttribute
  const uv = g.attributes.uv as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 0.25, p.getZ(i) * 0.25)
  const m = new THREE.Mesh(g, material)
  m.receiveShadow = true
  return m
}

/** Fluffy clouds that drift across the sky by day and dim at night. */
export function clouds(stage: Stage, count = 6) {
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: 0.95, fog: false })
  const list: THREE.Group[] = []
  for (let i = 0; i < count; i++) {
    const g = new THREE.Group()
    const puffs = 5 + (i % 3)
    for (let j = 0; j < puffs; j++) {
      const p = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 + ((i + j) % 3) * 0.6, 3), cloudMat)
      p.position.set(j * 1.5 - puffs * 0.75, Math.sin(j * 2.1) * 0.5 + (j % 2) * 0.4, Math.cos(j * 1.3) * 0.8)
      p.scale.y = 0.6
      g.add(p)
    }
    g.position.set(-90 + i * 34, 16 + (i % 3) * 4, -70 - ((i * 23) % 40))
    g.scale.setScalar(2.2)
    g.userData.speed = 0.5 + (i % 3) * 0.25
    list.push(g)
    stage.scene.add(g)
  }
  stage.animators.add((_t, dt) => {
    for (const c of list) {
      c.position.x += c.userData.speed * dt
      if (c.position.x > 110) c.position.x = -110
    }
  })
  stage.nightHooks.push((night) => {
    cloudMat.color.set(night ? '#2f4752' : '#ffffff')
    cloudMat.opacity = night ? 0.5 : 0.95
  })
}
