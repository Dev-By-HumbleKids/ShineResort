import * as THREE from 'three'
import { blob, clouds, cyl, type Stage } from './core'
import { bush, lantern, longtail, lounger, nightLight, palm, rbox, rock, thatchRoof, umbrella, windowGlass } from './nature'
import { surface, tex } from './textures'
import { createWater } from './water'

const G = 0.42 // ground level on the island

export const islandHotspots: Record<string, [number, number, number]> = {
  villas: [0, 2.4, -5.2],
  pool: [0, 1, 2],
  dining: [-4.5, 2.4, 1],
  spa: [4.8, 2, -1.6],
  jetty: [3.6, 1.6, 11],
  honeymoon: [-7.6, 3.2, 7.2],
  lighthouse: [7.8, 6, -3.6],
  riding: [6.4, 1.2, 5],
  cay: [-13, 2.6, -10],
}

const ISLAND = { radius: 9.2, wobble: 0.16, seed: 2 }

function poolWater(stage: Stage) {
  const m = new THREE.MeshStandardMaterial({ color: '#58c9cf', roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.88, emissive: '#1fb3c0', emissiveIntensity: 0 })
  m.userData.glow = 0.3
  stage.glowMaterials.push(m)
  return m
}

/** Plastered villa with timber veranda, glazing and a thatched roof. */
function villa(stage: Stage, x: number, z: number, rot: number, kind: 'garden' | 'pool') {
  const g = new THREE.Group()
  const plaster = surface('plaster', [1, 1])
  const wood = surface('wood', [1, 1])
  const stone = surface('stone', [1, 1])
  g.add(rbox(1.9, 0.16, 1.7, stone, [0, 0.08, 0], 0.03))
  g.add(rbox(1.5, 0.82, 1.05, plaster, [0, 0.57, -0.18], 0.03))
  const glass = windowGlass(stage)
  g.add(rbox(1.1, 0.55, 0.03, glass, [0, 0.55, 0.36], 0.01))
  g.add(rbox(1.7, 0.04, 0.55, surface('deck', [2, 1]), [0, 0.18, 0.55], 0.01))
  for (const px of [-0.78, 0.78]) g.add(rbox(0.06, 0.85, 0.06, wood, [px, 0.6, 0.78], 0.015))
  if (kind === 'garden') {
    const r = thatchRoof(1.6, 1.4, 0.95, 0.28)
    r.position.y = 1.45
    g.add(r)
  } else {
    g.add(rbox(1.95, 0.12, 1.75, plaster, [0, 1.04, 0.05], 0.03))
    g.add(rbox(2.0, 0.05, 1.8, wood, [0, 1.12, 0.05], 0.02))
    // plunge pool
    g.add(rbox(1.5, 0.12, 0.75, surface('tile', [3, 1.5]), [0, 0.06, 1.25], 0.02))
    g.add(rbox(1.36, 0.02, 0.62, poolWater(stage), [0, 0.12, 1.25], 0.01))
  }
  g.position.set(x, G, z)
  g.rotation.y = rot
  stage.scene.add(g)
}

function sailboat(stage: Stage, radius: number) {
  const b = new THREE.Group()
  const shape = new THREE.Shape()
  shape.moveTo(-0.9, 0.15)
  shape.quadraticCurveTo(-0.6, -0.12, 0.2, -0.14)
  shape.quadraticCurveTo(0.8, -0.08, 1.05, 0.2)
  shape.lineTo(-0.9, 0.2)
  const hull = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }),
    new THREE.MeshStandardMaterial({ color: '#f7f4ed', roughness: 0.35 }),
  )
  hull.geometry.translate(0, 0, -0.21)
  hull.castShadow = true
  b.add(hull)
  b.add(cyl(0.02, 0.025, 2.2, new THREE.MeshStandardMaterial({ color: '#c9b08a', roughness: 0.5 }), [0, 1.25, 0], 8))
  const sailMat = new THREE.MeshStandardMaterial({ color: '#fffaf0', roughness: 0.9, side: THREE.DoubleSide, map: tex('fabric', [3, 3]) })
  const main = new THREE.Shape()
  main.moveTo(0, 0)
  main.quadraticCurveTo(0.45, 1.0, 0, 2.0)
  main.lineTo(0, 0)
  const ms = new THREE.Mesh(new THREE.ShapeGeometry(main, 12), sailMat)
  ms.position.set(0.03, 0.3, 0)
  ms.rotation.y = Math.PI / 2
  ms.castShadow = true
  b.add(ms)
  const jib = new THREE.Shape()
  jib.moveTo(0, 0)
  jib.lineTo(0.85, 0)
  jib.lineTo(0, 1.7)
  const js = new THREE.Mesh(new THREE.ShapeGeometry(jib), sailMat)
  js.position.set(0.05, 0.3, 0)
  js.rotation.y = -0.2
  b.add(js)
  stage.scene.add(b)
  stage.animators.add((t) => {
    const a = t * 0.04 + 1.5
    b.position.set(Math.cos(a) * radius, 0.08 + Math.sin(t * 1.4) * 0.05, Math.sin(a) * radius * 0.85)
    b.rotation.y = -a - Math.PI / 2
    b.rotation.z = Math.sin(t * 1.1) * 0.05
    b.rotation.x = Math.sin(t * 0.9) * 0.03
  })
}

export function buildIsland(stage: Stage) {
  const { scene } = stage

  // ---------- sea, seabed, sand, lawn ----------
  const sea = createWater({ size: 220, segments: 180, island: { ...ISLAND, bevel: 0.45 }, shallowWidth: 9 })
  scene.add(sea.mesh)
  stage.animators.add((t) => sea.update(t))
  stage.nightHooks.push((night, dir) => sea.setLight(night, dir))

  const seabed = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#d6c29c', roughness: 1, map: tex('sand', [10, 10]) }))
  seabed.rotation.x = -Math.PI / 2
  seabed.position.y = -0.9
  seabed.receiveShadow = true
  scene.add(seabed)

  const sand = blob(ISLAND.radius, ISLAND.wobble, 0.5, surface('sand', [1, 1]), ISLAND.seed)
  sand.position.y = -0.5
  scene.add(sand)
  const lawn = blob(6.2, 0.2, 0.02, surface('grass', [1, 1]), 5)
  lawn.position.set(0, 0.05, -1.6)
  scene.add(lawn)

  const stone = surface('stone', [1, 1])
  const wood = surface('wood', [1, 1])
  const plaster = surface('plaster', [1, 1])

  // stone paths: reception → pool → beach, and along the villas
  const path = (x: number, z: number, w: number, d: number, r = 0) => {
    const p = rbox(w, 0.04, d, surface('stone', [w, d]), [x, G + 0.02, z], 0.02)
    p.rotation.y = r
    p.castShadow = false
    scene.add(p)
  }
  path(0, 0, 0.9, 3.2)
  path(0, -4, 8.5, 0.7)
  path(-2.3, -0.8, 0.7, 3.4, 0.6)
  path(2.6, -0.8, 0.7, 3.6, -0.6)

  // ---------- the Lamp Pavilion (reception) ----------
  const rec = new THREE.Group()
  rec.add(rbox(3.6, 0.3, 2.8, stone, [0, 0.15, 0], 0.05))
  rec.add(rbox(3.2, 0.04, 2.4, surface('deck', [3, 2]), [0, 0.32, 0], 0.02))
  for (const [px, pz] of [[-1.45, -1.1], [1.45, -1.1], [-1.45, 1.1], [1.45, 1.1], [0, -1.1], [0, 1.1]]) rec.add(cyl(0.07, 0.09, 1.7, wood, [px, 1.15, pz], 12))
  const recRoof = thatchRoof(3.4, 2.6, 1.6, 0.55)
  recRoof.position.y = 2.75
  rec.add(recRoof)
  rec.add(rbox(1.4, 0.55, 0.45, wood, [0, 0.6, -0.55], 0.04))
  const lampGlow = new THREE.MeshStandardMaterial({ color: '#f7e2b5', emissive: '#ffb257', emissiveIntensity: 0, roughness: 0.3 })
  stage.glowMaterials.push(lampGlow)
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), lampGlow)
  lamp.position.y = 1.75
  rec.add(lamp)
  rec.position.set(0, G, -2)
  scene.add(rec)
  nightLight(stage, [0, G + 1.6, -2], 9, 8)

  // ---------- the Long Pool ----------
  scene.add(rbox(6.6, 0.22, 1.8, stone, [0, G + 0.02, 2], 0.05))
  scene.add(rbox(6.0, 0.08, 1.25, surface('tile', [12, 2.5]), [0, G + 0.1, 2], 0.02))
  scene.add(rbox(5.9, 0.03, 1.15, poolWater(stage), [0, G + 0.16, 2], 0.01))
  for (let i = -2; i <= 2; i++) {
    const l = lounger()
    l.position.set(i * 1.2, G, 3.55)
    l.rotation.y = Math.PI
    scene.add(l)
    if (i % 2 === 0) {
      const u = umbrella(i === 0 ? '#e9dcc0' : '#f3e6cc')
      u.position.set(i * 1.2 + 0.55, G, 3.7)
      scene.add(u)
    }
  }
  for (const x of [-3.3, 3.3]) lantern(stage, [x, G, 2], 0.5)

  // ---------- Tidewater restaurant ----------
  const rest = new THREE.Group()
  rest.add(rbox(3.2, 0.24, 2.4, surface('deck', [3, 2]), [0, 0.12, 0], 0.03))
  for (const [px, pz] of [[-1.4, -1], [1.4, -1], [-1.4, 1], [1.4, 1]]) rest.add(cyl(0.06, 0.07, 1.3, wood, [px, 0.88, pz], 12))
  rest.add(rbox(3.6, 0.14, 2.8, plaster, [0, 1.58, 0], 0.04))
  rest.add(rbox(3.7, 0.06, 2.9, wood, [0, 1.68, 0], 0.03))
  const tableMat = new THREE.MeshStandardMaterial({ color: '#f6f1e6', roughness: 0.9, map: tex('fabric', [2, 2]) })
  for (let i = 0; i < 4; i++) {
    const tx = -0.75 + (i % 2) * 1.5
    const tz = -0.45 + Math.floor(i / 2) * 0.9
    rest.add(cyl(0.24, 0.24, 0.04, tableMat, [tx, 0.62, tz], 20))
    rest.add(cyl(0.03, 0.05, 0.4, wood, [tx, 0.42, tz], 8))
    for (const s of [-1, 1]) rest.add(rbox(0.16, 0.24, 0.16, wood, [tx + s * 0.38, 0.36, tz], 0.03))
  }
  rest.position.set(-4.5, G, 1)
  scene.add(rest)
  nightLight(stage, [-4.5, G + 1.3, 1], 8, 6)

  // ---------- villas ----------
  ;[-4.2, -2.1, 0, 2.1, 4.2].forEach((x) => villa(stage, x, -5.4 + Math.abs(x) * 0.12, 0, 'garden'))
  villa(stage, -7, 1.6, 0.5, 'pool')
  villa(stage, -6.8, -1.6, 0.9, 'pool')
  villa(stage, 7.2, 1.8, -0.5, 'pool')
  for (const x of [-3.15, -1.05, 1.05, 3.15]) lantern(stage, [x, G, -3.75], 0.4)

  // ---------- Lumina spa pavilions ----------
  ;[[4.2, -1], [5.4, -1.9], [4.4, -2.6]].forEach(([x, z]) => {
    const s = new THREE.Group()
    s.add(rbox(1, 0.12, 1, stone, [0, 0.06, 0], 0.03))
    s.add(rbox(0.75, 0.55, 0.75, plaster, [0, 0.38, 0], 0.03))
    s.add(rbox(0.5, 0.35, 0.02, windowGlass(stage), [0, 0.38, 0.38], 0.01))
    const r = thatchRoof(0.8, 0.8, 0.65, 0.2)
    r.position.y = 0.95
    s.add(r)
    s.position.set(x, G, z)
    scene.add(s)
  })
  nightLight(stage, [4.8, G + 0.9, -1.8], 4, 4)

  // ---------- lighthouse: the original “shine” ----------
  const lh = new THREE.Group()
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.66, 3.6, 32, 1), plaster)
  tower.position.y = 1.8
  tower.castShadow = true
  lh.add(tower)
  for (const y of [1.0, 2.4]) lh.add(cyl(0.6 - y * 0.06, 0.62 - y * 0.06, 0.18, new THREE.MeshStandardMaterial({ color: '#164b50', roughness: 0.6 }), [0, y, 0], 32))
  lh.add(cyl(0.6, 0.6, 0.08, new THREE.MeshStandardMaterial({ color: '#2b2b2b', roughness: 0.4, metalness: 0.6 }), [0, 3.62, 0], 32))
  const rail = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.015, 6, 40), new THREE.MeshStandardMaterial({ color: '#2b2b2b', metalness: 0.7, roughness: 0.3 }))
  rail.rotation.x = Math.PI / 2
  rail.position.y = 3.95
  lh.add(rail)
  const lensGlow = new THREE.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffd27a', emissiveIntensity: 0, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.85 })
  stage.glowMaterials.push(lensGlow)
  lh.add(cyl(0.34, 0.34, 0.55, lensGlow, [0, 3.95, 0], 24))
  lh.add(cyl(0.05, 0.42, 0.5, new THREE.MeshStandardMaterial({ color: '#c7a66a', metalness: 0.8, roughness: 0.3 }), [0, 4.48, 0], 24))
  lh.position.set(7.8, G, -3.6)
  scene.add(lh)
  const beacon = nightLight(stage, [7.8, G + 4, -3.6], 40, 18, '#ffd58a')
  stage.animators.add((t) => {
    if (beacon.visible) beacon.intensity = 34 + Math.sin(t * 2) * 8
  })

  // ---------- jetty & longtail ----------
  const planks = surface('deck', [1, 6])
  scene.add(rbox(0.8, 0.08, 6.6, planks, [3, 0.42, 8.4], 0.02))
  for (let zz = 5.4; zz <= 11.4; zz += 1.2)
    for (const xx of [2.66, 3.34]) scene.add(cyl(0.05, 0.06, 1.4, wood, [xx, -0.25, zz], 10))
  for (const zz of [6.5, 9.5]) lantern(stage, [2.62, 0.46, zz], 0.4)
  const boat = longtail()
  boat.position.set(3.95, 0.02, 10.6)
  boat.rotation.y = Math.PI / 2 + 0.05
  scene.add(boat)
  stage.animators.add((t) => {
    boat.position.y = 0.02 + Math.sin(t * 1.3) * 0.035
    boat.rotation.z = Math.sin(t * 1.05) * 0.025
  })
  nightLight(stage, [3, 1, 11], 4, 4)

  // ---------- over-lagoon honeymoon pavilions ----------
  ;[[-7.2, 7.4], [-9, 5.6], [-5.6, 9]].forEach(([x, z]) => {
    const p = new THREE.Group()
    for (const [sx, sz] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) p.add(cyl(0.045, 0.05, 1.6, wood, [sx, 0.2, sz], 8))
    p.add(rbox(1.6, 0.1, 1.6, surface('deck', [2, 2]), [0, 0.98, 0], 0.02))
    p.add(rbox(1.05, 0.62, 0.9, plaster, [0, 1.34, -0.18], 0.03))
    p.add(rbox(0.75, 0.38, 0.02, windowGlass(stage), [0, 1.34, 0.28], 0.01))
    const r = thatchRoof(1.2, 1.1, 1.0, 0.3)
    r.position.y = 2.15
    p.add(r)
    p.position.set(x, 0, z)
    p.rotation.y = 0.6
    scene.add(p)
  })
  const walk = rbox(0.45, 0.06, 4.8, planks, [-6.6, 0.95, 5.4], 0.02)
  walk.rotation.y = 0.75
  scene.add(walk)
  nightLight(stage, [-7.2, 1.9, 7.4], 6, 5)

  // ---------- riding beach ----------
  for (const [x, z, r] of [[6, 5.2, 0.3], [6.9, 4.4, -0.2]] as const) {
    const u = umbrella()
    u.position.set(x, G - 0.05, z)
    scene.add(u)
    const l = lounger()
    l.position.set(x - 0.5, G - 0.05, z + 0.4)
    l.rotation.y = Math.PI + r
    scene.add(l)
  }

  // ---------- Pearl Cay ----------
  const cay = blob(2.2, 0.25, 0.4, surface('sand', [1, 1]), 7)
  cay.position.set(-13, -0.45, -10)
  scene.add(cay)
  ;[[-13.3, -9.8, 2.4, 0.4], [-12.4, -10.4, 2, -0.5], [-13.8, -10.6, 1.7, 0.6]].forEach(([x, z, h, l]) => {
    const p = palm(h, l, x * 3)
    p.position.set(x, 0.2, z)
    scene.add(p)
  })

  // ---------- vegetation & rocks ----------
  const rim = 30
  for (let i = 0; i < rim; i++) {
    const a = (i / rim) * Math.PI * 2 + 0.2
    const r = 7.5 + Math.sin(i * 1.7) * 0.5
    const x = Math.cos(a) * r
    const zz = -Math.sin(a) * r * 0.78
    if (zz > 4 && Math.abs(x - 3) < 1.3) continue // keep the jetty clear
    if (zz > 0.6 && x > -5.6 && x < 5.8) continue // keep the sea view open
    const p = palm(2.4 + ((i * 37) % 10) / 9, 0.35 + ((i * 13) % 5) / 10, a + Math.PI, 0.85 + ((i * 7) % 4) * 0.06)
    p.position.set(x, G - 0.02, zz)
    scene.add(p)
  }
  const bushes: [number, number, number][] = [
    [-3.2, -3.2, 0.35], [3.3, -3.1, 0.4], [-5.5, -3.8, 0.45], [5.6, -3.5, 0.4], [-1.6, -0.6, 0.3], [1.7, -0.5, 0.3],
    [-6.2, -0.1, 0.4], [6.2, 0.2, 0.35], [2.4, -6.4, 0.45], [-2.4, -6.5, 0.45], [5.6, -4.8, 0.35], [-4.9, -5.9, 0.4],
  ]
  bushes.forEach(([x, zz, s], i) => {
    const b = bush(s, i % 3 ? '#557a48' : '#4a6e41')
    b.position.set(x, G, zz)
    scene.add(b)
  })
  ;[[8.4, 2.6, 0.5], [8.9, 1.6, 0.35], [-9.1, -2.2, 0.45], [-8.6, -3.4, 0.3], [1.5, -8.1, 0.4]].forEach(([x, zz, s]) => {
    const r = rock(s)
    r.position.set(x, 0.05, zz)
    r.rotation.y = x
    scene.add(r)
  })

  clouds(stage, 7)
  sailboat(stage, 20)
}
