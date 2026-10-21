import * as THREE from 'three'
import { blob, box, cyl, hipRoof, mat, palm, water, type Stage } from './core'

const G = 0.25 // ground level on the island

export const islandHotspots: Record<string, [number, number, number]> = {
  villas: [0, 2.2, -5.2],
  pool: [0, 0.9, 2],
  dining: [-4.5, 2.4, 1],
  spa: [4.8, 2, -1.6],
  jetty: [3.6, 1.4, 11],
  honeymoon: [-7.6, 3, 7.2],
  lighthouse: [7.8, 5.6, -3.6],
  riding: [6.4, 1, 5],
  cay: [-13, 2.2, -10],
}

function lantern(stage: Stage, pos: [number, number, number], intensity = 6, distance = 6) {
  const l = new THREE.PointLight('#ffb867', intensity, distance, 1.6)
  l.position.set(...pos)
  l.visible = false
  stage.nightLights.push(l)
  stage.scene.add(l)
}

function windowMat(stage: Stage) {
  const m = new THREE.MeshStandardMaterial({ color: '#f3dcb0', emissive: '#ffb45e', emissiveIntensity: 0, roughness: 0.6, flatShading: true })
  stage.glowMaterials.push(m)
  return m
}

function villa(stage: Stage, x: number, z: number, rot: number, kind: 'garden' | 'pool') {
  const g = new THREE.Group()
  const wall = mat('#efe6d6')
  const timber = mat('#8b6a4c')
  const glow = windowMat(stage)
  g.add(box(1.6, 0.12, 1.4, timber, [0, 0.06, 0]))
  g.add(box(1.4, 0.8, 1.1, wall, [0, 0.5, -0.05]))
  g.add(box(1.0, 0.45, 0.02, glow, [0, 0.5, 0.51]))
  if (kind === 'garden') {
    const r = hipRoof(2.0, 1.7, 0.9, mat('#6b5641'))
    r.position.y = 1.35
    g.add(r)
  } else {
    g.add(box(1.8, 0.12, 1.5, mat('#d8cdb8'), [0, 0.96, -0.05]))
    g.add(box(1.3, 0.08, 0.7, mat('#5cbcc0', { roughness: 0.2 }), [0, 0.1, 1.15]))
  }
  g.position.set(x, G, z)
  g.rotation.y = rot
  stage.scene.add(g)
}

export function buildIsland(stage: Stage) {
  const { scene } = stage

  // sea + seabed glow
  const sea = water(140, '#2f7f86', 56)
  scene.add(sea.mesh)
  stage.animators.add((t) => sea.animate(t))
  const shallow = blob(11.5, 0.18, 0.05, mat('#7fd0c6', { transparent: true, opacity: 0.55, roughness: 0.3 }), 2)
  shallow.position.y = -0.2
  scene.add(shallow)

  // island
  const sand = blob(9.2, 0.16, 0.5, mat('#ecdcbf'), 2)
  sand.position.y = -0.5
  scene.add(sand)
  const grass = blob(6.4, 0.2, 0.1, mat('#6f8d62'), 5)
  grass.position.set(0, 0.1, -1.6)
  scene.add(grass)

  // reception "Lamp Pavilion"
  const rec = new THREE.Group()
  rec.add(box(3.4, 0.25, 2.6, mat('#d9cbb2'), [0, 0.12, 0]))
  for (const [px, pz] of [[-1.4, -1.1], [1.4, -1.1], [-1.4, 1.1], [1.4, 1.1]]) rec.add(cyl(0.08, 0.1, 1.5, mat('#7a5b40'), [px, 1, pz], 6))
  const recRoof = hipRoof(4.6, 3.6, 1.6, mat('#5e4a37'))
  recRoof.position.y = 2.5
  rec.add(recRoof)
  rec.add(box(0.5, 0.5, 0.5, windowMat(stage), [0, 0.6, 0]))
  rec.position.set(0, G, -2)
  scene.add(rec)
  lantern(stage, [0, G + 1.4, -2], 8, 7)

  // long infinity pool + loungers
  scene.add(box(6.2, 0.16, 1.5, mat('#e6dccb'), [0, G + 0.02, 2]))
  const pool = box(5.8, 0.06, 1.15, new THREE.MeshStandardMaterial({ color: '#5cc6c8', roughness: 0.15, emissive: '#2aa7b0', emissiveIntensity: 0 }), [0, G + 0.12, 2])
  stage.glowMaterials.push(pool.material as THREE.MeshStandardMaterial)
  scene.add(pool)
  for (let i = -2; i <= 2; i++) scene.add(box(0.28, 0.06, 0.6, mat('#f7f4ed'), [i * 1.1, G + 0.08, 3.2]))

  // Tidewater restaurant deck
  const rest = new THREE.Group()
  rest.add(box(3, 0.2, 2.2, mat('#9b7756'), [0, 0.1, 0]))
  for (const [px, pz] of [[-1.3, -0.9], [1.3, -0.9], [-1.3, 0.9], [1.3, 0.9]]) rest.add(cyl(0.06, 0.06, 1.2, mat('#6b4f36'), [px, 0.8, pz], 6))
  rest.add(box(3.3, 0.14, 2.5, mat('#e9dfcd'), [0, 1.45, 0]))
  for (let i = 0; i < 4; i++) rest.add(cyl(0.18, 0.18, 0.05, mat('#f7f4ed'), [-0.9 + (i % 2) * 1.8, 0.5, -0.4 + Math.floor(i / 2) * 0.9], 10))
  rest.position.set(-4.5, G, 1)
  scene.add(rest)
  lantern(stage, [-4.5, G + 1.2, 1], 7, 6)

  // villas
  ;[-4.2, -2.1, 0, 2.1, 4.2].forEach((x, i) => villa(stage, x, -5.4 + Math.abs(x) * 0.12, 0, i % 2 ? 'garden' : 'garden'))
  villa(stage, -7, 1.6, 0.5, 'pool')
  villa(stage, -6.8, -1.6, 0.9, 'pool')
  villa(stage, 7.2, 1.8, -0.5, 'pool')
  lantern(stage, [0, G + 1.2, -4.5], 6, 9)

  // Lumina spa pavilions
  ;[[4.2, -1], [5.4, -1.9], [4.4, -2.6]].forEach(([x, z]) => {
    const s = new THREE.Group()
    s.add(box(0.9, 0.1, 0.9, mat('#d8cbb3'), [0, 0.05, 0]))
    s.add(box(0.7, 0.5, 0.7, mat('#f1ebe0'), [0, 0.35, 0]))
    const r = hipRoof(1.2, 1.2, 0.6, mat('#6b5641'))
    r.position.y = 0.9
    s.add(r)
    s.position.set(x, G, z)
    scene.add(s)
  })
  lantern(stage, [4.8, G + 0.8, -1.8], 4, 4)

  // lighthouse — the original "shine"
  const lh = new THREE.Group()
  lh.add(cyl(0.45, 0.65, 3.6, mat('#f4efe6'), [0, 1.8, 0], 10))
  lh.add(cyl(0.47, 0.47, 0.35, mat('#164b50'), [0, 2.4, 0], 10))
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 10), windowMat(stage))
  lamp.position.y = 3.85
  lh.add(lamp)
  lh.add(cyl(0.08, 0.55, 0.5, mat('#c7a66a', { metalness: 0.5, roughness: 0.4 }), [0, 4.35, 0], 10))
  lh.position.set(7.8, G, -3.6)
  scene.add(lh)
  const beacon = new THREE.PointLight('#ffcf7a', 25, 16, 1.4)
  beacon.position.set(7.8, G + 3.9, -3.6)
  beacon.visible = false
  stage.nightLights.push(beacon)
  scene.add(beacon)

  // jetty + longtail boat
  scene.add(box(0.7, 0.1, 6.5, mat('#8b6a4c'), [3, 0.32, 8.4]))
  for (let z = 5.6; z <= 11.2; z += 1.4) {
    scene.add(cyl(0.05, 0.05, 0.8, mat('#5e4532'), [2.7, 0, z], 5))
    scene.add(cyl(0.05, 0.05, 0.8, mat('#5e4532'), [3.3, 0, z], 5))
  }
  const boat = new THREE.Group()
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 2.6, 6, 1, false, 0, Math.PI), mat('#3c6f73'))
  hull.rotation.set(Math.PI / 2, 0, Math.PI / 2)
  hull.rotation.order = 'YXZ'
  hull.castShadow = true
  boat.add(hull)
  boat.add(box(1.2, 0.05, 0.5, mat('#c7a66a'), [0, 0.05, 0]))
  boat.add(box(0.06, 0.6, 0.06, mat('#5e4532'), [1.1, 0.3, 0]))
  boat.position.set(3.9, 0.15, 10.8)
  boat.rotation.y = Math.PI / 2
  scene.add(boat)
  stage.animators.add((t) => {
    boat.position.y = 0.15 + Math.sin(t * 1.4) * 0.04
    boat.rotation.z = Math.sin(t * 1.1) * 0.03
  })
  lantern(stage, [3, 0.9, 11], 4, 4)

  // over-lagoon honeymoon pavilions
  ;[[-7.2, 7.4], [-9, 5.6], [-5.6, 9]].forEach(([x, z]) => {
    const p = new THREE.Group()
    for (const [sx, sz] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) p.add(cyl(0.05, 0.05, 1.2, mat('#5e4532'), [sx, 0.3, sz], 5))
    p.add(box(1.5, 0.12, 1.5, mat('#9b7756'), [0, 0.95, 0]))
    p.add(box(1, 0.6, 0.9, mat('#f1ebe0'), [0, 1.3, -0.15]))
    p.add(box(0.7, 0.35, 0.02, windowMat(stage), [0, 1.3, 0.31]))
    const r = hipRoof(1.6, 1.4, 0.9, mat('#6b5641'))
    r.position.y = 2
    p.add(r)
    p.position.set(x, 0, z)
    p.rotation.y = 0.6
    scene.add(p)
  })
  // boardwalk to the pavilions
  const walk = box(0.4, 0.08, 4.6, mat('#8b6a4c'), [-6.6, 0.9, 5.4])
  walk.rotation.y = 0.75
  scene.add(walk)
  lantern(stage, [-7.2, 1.8, 7.4], 5, 5)

  // horse-riding beach marker: two parasols & a rail
  for (const [x, z] of [[6, 5.2], [6.9, 4.4]]) {
    scene.add(cyl(0.03, 0.03, 1, mat('#7a5b40'), [x, G + 0.5, z], 5))
    const top = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.3, 8), mat('#f2e4c9'))
    top.position.set(x, G + 1.05, z)
    top.castShadow = true
    scene.add(top)
  }

  // Pearl Cay — a small fictional islet
  const cay = blob(2.2, 0.25, 0.4, mat('#ecdcbf'), 7)
  cay.position.set(-13, -0.45, -10)
  scene.add(cay)
  for (const [x, z, h] of [[-13.3, -9.8, 1.8], [-12.4, -10.4, 1.4], [-13.8, -10.6, 1.2]]) {
    const p = palm(h, 0.3)
    p.position.set(x, 0.1, z)
    scene.add(p)
  }

  // palms around the rim
  const rim = 28
  for (let i = 0; i < rim; i++) {
    const a = (i / rim) * Math.PI * 2 + 0.2
    const r = 7.6 + Math.sin(i * 1.7) * 0.5
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r * 0.78
    if (z > 4 && Math.abs(x - 3) < 1.2) continue // keep the jetty clear
    if (z > 1 && x > -5.6 && x < 5.6) continue // keep the sea view open
    const p = palm(1.8 + ((i * 37) % 10) / 10, 0.15 + ((i * 13) % 5) / 20)
    p.position.set(x, G, z)
    p.rotation.y = a + Math.PI
    scene.add(p)
  }
}
