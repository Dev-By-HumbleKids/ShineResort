import * as THREE from 'three'
import type { Room } from '../data/types'
import { blob, box, cyl, hipRoof, mat, palm, water, type Stage } from './core'

const WALL_H = 2.6

/** Builds a cut-away "dollhouse" model of a villa from its data description. */
export function buildVilla(stage: Stage, room: Room) {
  const { scene } = stage
  const { width: w, depth: d, storeys, roof, pool, stilts } = room.model
  const base = stilts ? 1.5 : 0.2

  const wall = mat('#f1ebe0')
  const wallInner = mat('#e6dccb')
  const timber = mat('#9b7756')
  const darkTimber = mat('#6b4f36')
  const linen = mat('#fbf8f2')
  const stone = mat('#d8cdb8')
  const accent = mat('#4d8990')
  const glow = new THREE.MeshStandardMaterial({ color: '#f6e6c4', emissive: '#ffb45e', emissiveIntensity: 0, roughness: 0.5, flatShading: true })
  stage.glowMaterials.push(glow)

  // ---------- setting ----------
  if (stilts) {
    const sea = water(80, '#3b9a9c', 40)
    sea.mesh.position.y = 0
    scene.add(sea.mesh)
    stage.animators.add((t) => sea.animate(t))
    const sandbar = blob(5, 0.2, 0.3, mat('#ecdcbf'), 3)
    sandbar.position.set(-9, -0.4, -6)
    scene.add(sandbar)
  } else {
    const sea = water(80, '#2f7f86', 32)
    sea.mesh.position.y = -0.35
    scene.add(sea.mesh)
    stage.animators.add((t) => sea.animate(t))
    const ground = blob(Math.max(w, d) * 1.25, 0.12, 0.3, mat('#ecdcbf'), 4)
    ground.position.y = -0.35
    scene.add(ground)
    const lawn = blob(Math.max(w, d) * 0.85, 0.15, 0.05, mat(room.view === 'Garden' ? '#6f8d62' : '#7d9a6b'), 6)
    lawn.position.set(0, -0.08, -1)
    scene.add(lawn)
  }

  const house = new THREE.Group()
  scene.add(house)

  // ---------- structure ----------
  if (stilts) {
    for (const x of [-w / 2 + 0.3, 0, w / 2 - 0.3]) for (const z of [-d / 2 + 0.3, d / 2 - 0.3, d / 2 + 1.6]) house.add(cyl(0.09, 0.09, base + 0.6, darkTimber, [x, (base - 0.6) / 2, z], 6))
    // ladder into the lagoon
    for (let i = 0; i < 4; i++) house.add(box(0.6, 0.05, 0.08, darkTimber, [w / 2 - 0.8, base - 0.3 - i * 0.35, d / 2 + 2.55]))
  }
  house.add(box(w + 0.3, 0.25, d + 0.3, stilts ? timber : stone, [0, base - 0.12, 0]))
  house.add(box(w, 0.04, d, mat('#b48a63'), [0, base + 0.02, 0]))

  // walls: back + two sides; the front stays open like a dollhouse
  const H = WALL_H * storeys
  house.add(box(w, H, 0.18, wall, [0, base + H / 2, -d / 2 + 0.09]))
  house.add(box(0.18, H, d, wall, [-w / 2 + 0.09, base + H / 2, 0]))
  house.add(box(0.18, H, d, wall, [w / 2 - 0.09, base + H / 2, 0]))
  // windows in the back wall
  house.add(box(w * 0.45, 1.1, 0.02, glow, [-w * 0.15, base + 1.5, -d / 2 + 0.19]))
  // partition between bedroom and bathroom
  house.add(box(0.12, WALL_H * 0.85, d * 0.45, wallInner, [w * 0.18, base + WALL_H * 0.42, -d / 2 + d * 0.225]))
  // glass front — a ghosted pane so the cut-away still reads as glazing
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.4, WALL_H - 0.3, 0.04),
    new THREE.MeshStandardMaterial({ color: '#cfe9ea', transparent: true, opacity: 0.12, roughness: 0.05 }),
  )
  glass.position.set(0, base + WALL_H / 2, d / 2 - 0.05)
  house.add(glass)

  // ---------- furniture ----------
  const bedX = -w / 4
  const bedZ = -d / 2 + 1.45
  house.add(box(1.9, 0.35, 2.1, timber, [bedX, base + 0.2, bedZ]))
  house.add(box(1.8, 0.22, 2, linen, [bedX, base + 0.48, bedZ + 0.02]))
  house.add(box(1.9, 0.12, 0.8, accent, [bedX, base + 0.6, bedZ + 0.55]))
  house.add(box(2.1, 1.1, 0.12, darkTimber, [bedX, base + 0.75, -d / 2 + 0.26]))
  for (const px of [-0.45, 0.45]) house.add(box(0.6, 0.16, 0.35, linen, [bedX + px, base + 0.66, bedZ - 0.75]))
  for (const sx of [-1.25, 1.25]) house.add(box(0.4, 0.45, 0.4, darkTimber, [bedX + sx, base + 0.24, -d / 2 + 0.55]))

  // bathroom
  const tubMat = room.id === 'sunrise-honeymoon-pavilion' ? mat('#b87333', { metalness: 0.6, roughness: 0.35 }) : linen
  house.add(box(1.5, 0.55, 0.8, tubMat, [w / 2 - 1.1, base + 0.28, -d / 2 + 0.65]))
  house.add(box(1.3, 0.1, 0.6, mat('#9fd3d4', { roughness: 0.1 }), [w / 2 - 1.1, base + 0.52, -d / 2 + 0.65]))
  house.add(box(1.1, 0.8, 0.5, stone, [w / 2 - 0.55, base + 0.4, -d / 2 + 1.9]))

  // living: sofa, table, rug
  const livX = storeys === 2 ? -w / 4 : w / 5
  const livZ = d / 2 - 1.2
  house.add(box(2.2, 0.03, 1.6, mat('#c7a66a'), [livX, base + 0.05, livZ]))
  house.add(box(2, 0.4, 0.75, mat('#e9ddc9'), [livX, base + 0.22, livZ - 0.55]))
  house.add(box(2, 0.45, 0.2, mat('#e9ddc9'), [livX, base + 0.5, livZ - 0.85]))
  house.add(box(0.8, 0.28, 0.5, darkTimber, [livX, base + 0.15, livZ + 0.3]))
  // plants
  for (const [px, pz] of [[-w / 2 + 0.5, d / 2 - 0.5], [w / 2 - 0.5, d / 2 - 0.5]]) {
    house.add(cyl(0.2, 0.15, 0.4, stone, [px, base + 0.2, pz], 8))
    const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 0), mat('#536c55'))
    leaves.position.set(px, base + 0.7, pz)
    leaves.castShadow = true
    house.add(leaves)
  }

  // upper storey (Royal Beach Residence)
  if (storeys === 2) {
    const slabD = d * 0.6
    house.add(box(w, 0.2, slabD, stone, [0, base + WALL_H, -d / 2 + slabD / 2]))
    house.add(box(w, 0.6, 0.06, new THREE.MeshStandardMaterial({ color: '#cfe9ea', transparent: true, opacity: 0.35 }), [0, base + WALL_H + 0.4, -d / 2 + slabD]))
    const ux = w / 5
    house.add(box(1.9, 0.35, 2, timber, [ux, base + WALL_H + 0.28, -d / 2 + 1.3]))
    house.add(box(1.8, 0.2, 1.9, linen, [ux, base + WALL_H + 0.55, -d / 2 + 1.32]))
    house.add(box(1.9, 0.12, 0.7, accent, [ux, base + WALL_H + 0.66, -d / 2 + 1.8]))
    // stairs
    for (let i = 0; i < 9; i++) house.add(box(0.9, 0.12, 0.3, timber, [w / 2 - 0.7, base + 0.15 + i * 0.28, d / 2 - 1.1 - i * 0.28]))
    // twin room downstairs right
    for (const tx of [-0.5, 0.5]) house.add(box(0.8, 0.45, 1.8, linen, [w / 2 - 2.2 + tx, base + 0.24, -d / 2 + 1.3]))
    // kitchen island
    house.add(box(1.8, 0.9, 0.7, stone, [0.6, base + 0.45, 0.6]))
  }

  // ---------- terrace & pool ----------
  const deckD = pool ? 1.4 : 2.2
  house.add(box(w + 0.3, 0.2, deckD, timber, [0, base - 0.1, d / 2 + deckD / 2 + 0.15]))
  for (const lx of [-1, 1]) {
    const lounger = box(0.55, 0.12, 1.4, linen, [lx * (w / 4) + (pool ? 0 : 1), base + 0.1, d / 2 + deckD / 2 + 0.15])
    lounger.rotation.x = -0.12
    house.add(lounger)
  }
  if (pool) {
    const pw = room.model.width > 9 ? 9 : w * 0.85
    const pz = d / 2 + deckD + 0.15 + 0.9
    house.add(box(pw + 0.4, 0.5, 2.2, stone, [0, base - 0.3, pz]))
    const poolMat = new THREE.MeshStandardMaterial({ color: '#5cc6c8', roughness: 0.12, emissive: '#2aa7b0', emissiveIntensity: 0, flatShading: true })
    stage.glowMaterials.push(poolMat)
    house.add(box(pw, 0.08, 1.8, poolMat, [0, base - 0.02, pz]))
  }
  if (room.view === 'Garden') {
    // courtyard wall + outdoor shower screen
    house.add(box(w + 3, 1.2, 0.2, stone, [0, 0.4, d / 2 + deckD + 1.8]))
    house.add(box(0.2, 1.2, d + deckD + 2, stone, [-w / 2 - 1.4, 0.4, deckD / 2 + 0.6]))
    // sala with daybed
    const sala = new THREE.Group()
    sala.add(box(2, 0.2, 1.6, timber, [0, 0.1, 0]))
    for (const [x, z] of [[-0.85, -0.65], [0.85, -0.65], [-0.85, 0.65], [0.85, 0.65]]) sala.add(cyl(0.05, 0.05, 1.6, darkTimber, [x, 0.9, z], 6))
    sala.add(box(1.4, 0.25, 1, linen, [0, 0.33, 0]))
    const sr = hipRoof(2.6, 2.2, 0.8, mat('#6b5641'))
    sr.position.y = 2
    sala.add(sr)
    sala.position.set(0, 0.1, d / 2 + deckD + 0.9 + 1.1)
    sala.scale.setScalar(0.85)
    house.add(sala)
  }

  // ---------- roof (lifted to reveal the interior) ----------
  const roofGroup = new THREE.Group()
  const roofMat = new THREE.MeshStandardMaterial({ color: roof === 'flat' ? '#d8cdb8' : '#6b5641', transparent: true, opacity: 0.92, roughness: 0.9, flatShading: true })
  if (roof === 'flat') {
    roofGroup.add(box(w + 1.2, 0.25, d + 1.2, roofMat))
    roofGroup.add(box(w + 1.3, 0.08, d + 1.3, mat('#9b7756')))
  } else {
    const r = hipRoof(w + 1.6, d + 1.4, roof === 'pavilion' ? 2.2 : 1.7, roofMat)
    r.position.y = roof === 'pavilion' ? 1.1 : 0.85
    roofGroup.add(r)
  }
  const closedY = base + H + 0.12
  const liftedY = closedY + 2.8
  roofGroup.position.y = liftedY
  roofGroup.traverse((o) => ((o as THREE.Mesh).castShadow = false))
  scene.add(roofGroup)

  let roofTarget = liftedY
  stage.animators.add(() => {
    roofGroup.position.y += (roofTarget - roofGroup.position.y) * 0.08
  })
  const setRoof = (lifted: boolean) => {
    roofTarget = lifted ? liftedY : closedY
    roofMat.opacity = lifted ? 0.92 : 1
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) roofGroup.position.y = roofTarget
    stage.invalidate()
  }

  // ---------- lighting accents ----------
  const interior = new THREE.PointLight('#ffb867', 10, 9, 1.5)
  interior.position.set(0, base + 1.8, 0)
  interior.visible = false
  stage.nightLights.push(interior)
  scene.add(interior)
  const terraceLight = new THREE.PointLight('#ffcf8a', 6, 6, 1.6)
  terraceLight.position.set(0, base + 0.9, d / 2 + 1.5)
  terraceLight.visible = false
  stage.nightLights.push(terraceLight)
  scene.add(terraceLight)

  // palms
  const palmSpots: [number, number][] = [[-w / 2 - 2, -d / 2 - 1], [w / 2 + 1.8, -d / 2 + 0.5], [-w / 2 - 1.5, d / 2 + 1.5], [w / 2 + 2.4, d / 2 + 2.2]]
  palmSpots.forEach(([x, z], i) => {
    const p = palm(2.8 + (i % 2) * 0.8, 0.2 + i * 0.05)
    p.position.set(x, stilts ? -0.2 : -0.05, z)
    p.rotation.y = i * 1.3
    if (!stilts || i === 0) scene.add(p)
  })

  return { setRoof, height: base + H }
}
