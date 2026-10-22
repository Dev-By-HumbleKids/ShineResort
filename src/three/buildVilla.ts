import * as THREE from 'three'
import type { Room } from '../data/types'
import { blob, clouds, cyl, type Stage } from './core'
import { bush, lantern, lounger, nightLight, palm, rbox, rock, thatchRoof, umbrella, windowGlass } from './nature'
import { surface, tex } from './textures'
import { createWater } from './water'

const WALL_H = 2.6

/** Builds a cut-away "dollhouse" model of a villa from its data description. */
export function buildVilla(stage: Stage, room: Room) {
  const { scene } = stage
  const { width: w, depth: d, storeys, roof, pool, stilts } = room.model
  const base = stilts ? 1.5 : 0.2

  const plaster = surface('plaster', [2, 1])
  const plasterIn = surface('plaster', [2, 1], { color: '#efe6d6' })
  const wood = surface('wood', [1, 1])
  const dark = surface('wood', [1, 1], { color: '#6b4f36' })
  const stone = surface('stone', [2, 2])
  const floor = surface('deck', [w / 1.5, d / 1.5], { color: '#d7b48a' })
  const linen = new THREE.MeshStandardMaterial({ color: '#fbf8f2', roughness: 0.95, map: tex('fabric', [3, 3]) })
  const accent = new THREE.MeshStandardMaterial({ color: '#4d8990', roughness: 0.9, map: tex('fabric', [3, 3]) })
  const brass = new THREE.MeshStandardMaterial({ color: '#c7a66a', metalness: 0.85, roughness: 0.3 })
  const glow = windowGlass(stage)

  // ---------- setting ----------
  const groundR = Math.max(w, d) * 1.25
  if (stilts) {
    const sea = createWater({ size: 200, segments: 160, lagoon: true, shallow: '#4fd0c6', deep: '#1d8a92' })
    scene.add(sea.mesh)
    stage.animators.add((t) => sea.update(t))
    stage.nightHooks.push((night, dir) => sea.setLight(night, dir))
    const seabed = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: '#e2d2ad', roughness: 1, map: tex('sand', [14, 14]) }))
    seabed.rotation.x = -Math.PI / 2
    seabed.position.y = -0.7
    scene.add(seabed)
    const sandbar = blob(5, 0.2, 0.3, surface('sand'), 3)
    sandbar.position.set(-11, -0.55, -8)
    scene.add(sandbar)
    const p = palm(2.6, 0.5, 1)
    p.position.set(-10.5, 0.1, -8)
    scene.add(p)
  } else {
    const sea = createWater({ size: 200, segments: 160, island: { radius: groundR, wobble: 0.12, seed: 4, bevel: 0.45 }, shallowWidth: 7 })
    scene.add(sea.mesh)
    stage.animators.add((t) => sea.update(t))
    stage.nightHooks.push((night, dir) => sea.setLight(night, dir))
    const seabed = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: '#d6c29c', roughness: 1, map: tex('sand', [14, 14]) }))
    seabed.rotation.x = -Math.PI / 2
    seabed.position.y = -0.9
    scene.add(seabed)
    const ground = blob(groundR, 0.12, 0.35, surface('sand'), 4)
    ground.position.y = -0.6 // sand surface sits just below the villa plinth
    scene.add(ground)
    const lawn = blob(Math.max(w, d) * 0.85, 0.15, 0.02, surface('grass'), 6)
    lawn.position.set(0, -0.36, -1)
    scene.add(lawn)
  }

  const house = new THREE.Group()
  scene.add(house)

  // ---------- structure ----------
  if (stilts) {
    for (const x of [-w / 2 + 0.3, 0, w / 2 - 0.3]) for (const z of [-d / 2 + 0.3, d / 2 - 0.3, d / 2 + 1.6]) house.add(cyl(0.09, 0.1, base + 1.2, dark, [x, (base - 1.2) / 2, z], 12))
    for (let i = 0; i < 5; i++) house.add(rbox(0.6, 0.05, 0.08, dark, [w / 2 - 0.8, base - 0.25 - i * 0.32, d / 2 + 2.55], 0.01))
    for (const s of [-1, 1]) house.add(cyl(0.025, 0.025, 1.8, brass, [w / 2 - 0.8 + s * 0.3, base - 0.6, d / 2 + 2.6], 8))
  }
  house.add(rbox(w + 0.4, 0.3, d + 0.4, stilts ? wood : stone, [0, base - 0.15, 0], 0.05))
  house.add(rbox(w, 0.04, d, floor, [0, base + 0.02, 0], 0.01))

  // walls: back + two sides; the front stays open like a dollhouse
  const H = WALL_H * storeys
  house.add(rbox(w, H, 0.2, plaster, [0, base + H / 2, -d / 2 + 0.1], 0.04))
  house.add(rbox(0.2, H, d, plaster, [-w / 2 + 0.1, base + H / 2, 0], 0.04))
  house.add(rbox(0.2, H, d, plaster, [w / 2 - 0.1, base + H / 2, 0], 0.04))
  // timber window frame + glass in the back wall
  house.add(rbox(w * 0.5, 1.25, 0.06, dark, [-w * 0.15, base + 1.5, -d / 2 + 0.22], 0.02))
  house.add(rbox(w * 0.46, 1.15, 0.03, glow, [-w * 0.15, base + 1.5, -d / 2 + 0.26], 0.01))
  house.add(rbox(0.04, 1.15, 0.05, dark, [-w * 0.15, base + 1.5, -d / 2 + 0.27], 0.01))
  // partition between bedroom and bathroom
  house.add(rbox(0.12, WALL_H * 0.85, d * 0.45, plasterIn, [w * 0.18, base + WALL_H * 0.42, -d / 2 + d * 0.225], 0.03))
  // glazed front (ghosted so the cut-away still reads as glass)
  const front = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.4, WALL_H - 0.3, 0.03),
    new THREE.MeshPhysicalMaterial({ color: '#d9eeee', transparent: true, opacity: 0.12, roughness: 0.02, metalness: 0, clearcoat: 1 }),
  )
  front.position.set(0, base + WALL_H / 2, d / 2 - 0.05)
  house.add(front)
  for (const x of [-(w - 0.4) / 2, 0, (w - 0.4) / 2]) house.add(rbox(0.06, WALL_H - 0.3, 0.07, dark, [x, base + WALL_H / 2, d / 2 - 0.05], 0.015))

  // ---------- furniture ----------
  const bedX = -w / 4
  const bedZ = -d / 2 + 1.45
  house.add(rbox(1.95, 0.32, 2.15, wood, [bedX, base + 0.18, bedZ], 0.05))
  house.add(rbox(1.82, 0.24, 2.02, linen, [bedX, base + 0.46, bedZ + 0.02], 0.1))
  house.add(rbox(1.86, 0.08, 0.85, accent, [bedX, base + 0.6, bedZ + 0.55], 0.04))
  house.add(rbox(2.15, 1.15, 0.12, dark, [bedX, base + 0.78, -d / 2 + 0.28], 0.04))
  for (const px of [-0.45, 0.45]) house.add(rbox(0.62, 0.17, 0.36, linen, [bedX + px, base + 0.66, bedZ - 0.74], 0.08))
  for (const sx of [-1.3, 1.3]) {
    house.add(rbox(0.42, 0.45, 0.4, dark, [bedX + sx, base + 0.24, -d / 2 + 0.6], 0.03))
    const lampGlow = new THREE.MeshStandardMaterial({ color: '#f7e6c4', emissive: '#ffb257', emissiveIntensity: 0, roughness: 0.6 })
    stage.glowMaterials.push(lampGlow)
    house.add(cyl(0.11, 0.14, 0.2, lampGlow, [bedX + sx, base + 0.62, -d / 2 + 0.6], 16))
  }
  // rug
  house.add(rbox(2.4, 0.015, 1.4, new THREE.MeshStandardMaterial({ color: '#c7a66a', roughness: 1, map: tex('fabric', [4, 3]) }), [bedX, base + 0.05, bedZ + 1.5], 0.005))

  // bathroom: tub, vanity, basin, mirror
  const tubMat = room.id === 'sunrise-honeymoon-pavilion' ? new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 0.75, roughness: 0.3 }) : new THREE.MeshStandardMaterial({ color: '#f7f5f0', roughness: 0.2 })
  house.add(rbox(1.55, 0.55, 0.82, tubMat, [w / 2 - 1.1, base + 0.3, -d / 2 + 0.66], 0.2))
  house.add(rbox(1.3, 0.04, 0.6, new THREE.MeshStandardMaterial({ color: '#8fd6d7', roughness: 0.05, transparent: true, opacity: 0.8 }), [w / 2 - 1.1, base + 0.5, -d / 2 + 0.66], 0.02))
  house.add(rbox(1.1, 0.75, 0.5, stone, [w / 2 - 0.55, base + 0.38, -d / 2 + 1.95], 0.03))
  house.add(cyl(0.18, 0.12, 0.1, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 }), [w / 2 - 0.55, base + 0.8, -d / 2 + 1.95], 20))
  house.add(rbox(0.04, 0.6, 0.45, new THREE.MeshStandardMaterial({ color: '#cfe3e6', metalness: 1, roughness: 0.05 }), [w / 2 - 0.22, base + 1.45, -d / 2 + 1.95], 0.01))

  // living: sofa with cushions, coffee table, rug, plants
  const livX = storeys === 2 ? -w / 4 : w / 5
  const livZ = d / 2 - 1.2
  const sofa = new THREE.MeshStandardMaterial({ color: '#e7dcc8', roughness: 0.95, map: tex('fabric', [3, 2]) })
  house.add(rbox(2.4, 0.02, 1.7, new THREE.MeshStandardMaterial({ color: '#cbb48a', roughness: 1, map: tex('fabric', [4, 3]) }), [livX, base + 0.05, livZ], 0.005))
  house.add(rbox(2.0, 0.3, 0.8, sofa, [livX, base + 0.2, livZ - 0.55], 0.08))
  house.add(rbox(2.0, 0.5, 0.2, sofa, [livX, base + 0.45, livZ - 0.9], 0.08))
  for (const s of [-1, 1]) house.add(rbox(0.2, 0.42, 0.8, sofa, [livX + s * 0.95, base + 0.3, livZ - 0.55], 0.08))
  for (const s of [-0.5, 0.5]) house.add(rbox(0.45, 0.4, 0.12, accent, [livX + s, base + 0.5, livZ - 0.75], 0.06))
  house.add(rbox(0.9, 0.06, 0.55, dark, [livX, base + 0.32, livZ + 0.3], 0.02))
  for (const [sx, sz] of [[-0.38, -0.2], [0.38, -0.2], [-0.38, 0.2], [0.38, 0.2]]) house.add(rbox(0.04, 0.28, 0.04, dark, [livX + sx, base + 0.16, livZ + 0.3 + sz], 0.01))
  for (const [px, pz] of [[-w / 2 + 0.5, d / 2 - 0.5], [w / 2 - 0.5, d / 2 - 0.5]]) {
    house.add(cyl(0.2, 0.15, 0.42, stone, [px, base + 0.22, pz], 16))
    const b = bush(0.25, '#4f7a4a')
    b.position.set(px, base + 0.38, pz)
    house.add(b)
  }

  // upper storey (Royal Beach Residence)
  if (storeys === 2) {
    const slabD = d * 0.6
    house.add(rbox(w, 0.22, slabD, stone, [0, base + WALL_H, -d / 2 + slabD / 2], 0.03))
    house.add(rbox(w, 0.7, 0.04, new THREE.MeshPhysicalMaterial({ color: '#d9eeee', transparent: true, opacity: 0.3, roughness: 0.02 }), [0, base + WALL_H + 0.45, -d / 2 + slabD], 0.01))
    house.add(rbox(w, 0.05, 0.06, brass, [0, base + WALL_H + 0.82, -d / 2 + slabD], 0.01))
    const ux = w / 5
    house.add(rbox(1.95, 0.32, 2.05, wood, [ux, base + WALL_H + 0.28, -d / 2 + 1.3], 0.05))
    house.add(rbox(1.82, 0.22, 1.92, linen, [ux, base + WALL_H + 0.54, -d / 2 + 1.32], 0.1))
    house.add(rbox(1.86, 0.08, 0.7, accent, [ux, base + WALL_H + 0.67, -d / 2 + 1.8], 0.04))
    for (let i = 0; i < 9; i++) house.add(rbox(0.9, 0.1, 0.3, wood, [w / 2 - 0.7, base + 0.15 + i * 0.28, d / 2 - 1.1 - i * 0.28], 0.02))
    for (const tx of [-0.5, 0.5]) house.add(rbox(0.85, 0.42, 1.85, linen, [w / 2 - 2.2 + tx, base + 0.24, -d / 2 + 1.3], 0.08))
    house.add(rbox(1.9, 0.92, 0.75, stone, [0.6, base + 0.46, 0.6], 0.04))
    for (const s of [-0.5, 0, 0.5]) house.add(cyl(0.12, 0.12, 0.05, wood, [0.6 + s, base + 0.65, 1.2], 16))
  }

  // ---------- terrace & pool ----------
  const deckD = pool ? 1.4 : 2.2
  house.add(rbox(w + 0.4, 0.2, deckD, surface('deck', [w / 1.2, deckD / 1.2]), [0, base - 0.1, d / 2 + deckD / 2 + 0.2], 0.03))
  for (const lx of [-1, 1]) {
    const l = lounger()
    l.position.set(lx * (w / 4) + (pool ? 0 : 1), base, d / 2 + deckD / 2 + 0.25)
    l.rotation.y = Math.PI
    house.add(l)
  }
  if (!pool && !stilts) {
    const u = umbrella()
    u.position.set(w / 4 + 1.8, base, d / 2 + deckD / 2 + 0.2)
    house.add(u)
  }
  if (pool) {
    const pw = room.model.width > 9 ? 9 : w * 0.85
    const pz = d / 2 + deckD + 0.2 + 0.95
    house.add(rbox(pw + 0.5, 0.5, 2.3, stone, [0, base - 0.3, pz], 0.05))
    house.add(rbox(pw, 0.12, 1.8, surface('tile', [pw * 1.5, 3]), [0, base - 0.08, pz], 0.02))
    const poolMat = new THREE.MeshStandardMaterial({ color: '#56cbd0', roughness: 0.03, metalness: 0.1, transparent: true, opacity: 0.85, emissive: '#1fb3c0', emissiveIntensity: 0 })
    poolMat.userData.glow = 0.3
    stage.glowMaterials.push(poolMat)
    house.add(rbox(pw - 0.05, 0.03, 1.75, poolMat, [0, base + 0, pz], 0.01))
  }
  if (room.view === 'Garden') {
    // courtyard wall, outdoor sala with daybed
    house.add(rbox(w + 3, 1.2, 0.22, stone, [0, 0.4, d / 2 + deckD + 1.8], 0.05))
    house.add(rbox(0.22, 1.2, d + deckD + 2, stone, [-w / 2 - 1.4, 0.4, deckD / 2 + 0.6], 0.05))
    const sala = new THREE.Group()
    sala.add(rbox(2, 0.2, 1.6, surface('deck', [2, 2]), [0, 0.1, 0], 0.03))
    for (const [x, z] of [[-0.85, -0.65], [0.85, -0.65], [-0.85, 0.65], [0.85, 0.65]]) sala.add(cyl(0.05, 0.06, 1.6, wood, [x, 0.9, z], 10))
    sala.add(rbox(1.4, 0.25, 1, linen, [0, 0.33, 0], 0.08))
    const sr = thatchRoof(2, 1.6, 0.85, 0.3)
    sr.position.y = 2.05
    sala.add(sr)
    sala.position.set(0, 0.1, d / 2 + deckD + 0.9 + 1.1)
    sala.scale.setScalar(0.85)
    house.add(sala)
  }

  // ---------- roof (lifted to reveal the interior) ----------
  const roofGroup = new THREE.Group()
  let roofMats: THREE.Material[] = []
  if (roof === 'flat') {
    const slab = rbox(w + 1.2, 0.26, d + 1.2, surface('plaster', [3, 3], { transparent: true }), [0, 0, 0], 0.06)
    const fascia = rbox(w + 1.3, 0.08, d + 1.3, surface('wood', [2, 2], { transparent: true }), [0, 0.16, 0], 0.03)
    roofGroup.add(slab, fascia)
    roofMats = [slab.material as THREE.Material, fascia.material as THREE.Material]
  } else {
    const r = thatchRoof(w + 1, d + 0.8, roof === 'pavilion' ? 2.2 : 1.7, 0.4)
    // own copy so lifting this roof never fades other thatched roofs
    r.material = (r.material as THREE.MeshStandardMaterial).clone()
    ;(r.material as THREE.MeshStandardMaterial).transparent = true
    r.position.y = roof === 'pavilion' ? 1.1 : 0.85
    roofGroup.add(r)
    roofMats = [r.material as THREE.Material]
  }
  const closedY = base + H + 0.12
  const liftedY = closedY + 2.8
  roofGroup.position.y = liftedY
  roofGroup.traverse((o) => ((o as THREE.Mesh).castShadow = false))
  scene.add(roofGroup)
  const setRoofOpacity = (o: number) => roofMats.forEach((m) => ((m as THREE.MeshStandardMaterial).opacity = o))
  setRoofOpacity(0.92)

  let roofTarget = liftedY
  stage.animators.add(() => {
    roofGroup.position.y += (roofTarget - roofGroup.position.y) * 0.08
  })
  const setRoof = (lifted: boolean) => {
    roofTarget = lifted ? liftedY : closedY
    setRoofOpacity(lifted ? 0.92 : 1)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) roofGroup.position.y = roofTarget
    stage.invalidate()
  }

  // ---------- lighting accents ----------
  nightLight(stage, [0, base + 1.9, 0], 12, 9)
  nightLight(stage, [0, base + 0.9, d / 2 + 1.5], 6, 6, '#ffcf8a')
  for (const x of [-w / 2 - 0.4, w / 2 + 0.4]) if (!stilts) lantern(stage, [x, 0, d / 2 + deckD + 0.4], 0.45)

  // ---------- garden ----------
  if (!stilts) {
    const palms: [number, number, number, number][] = [
      [-w / 2 - 2, -d / 2 - 1, 3.2, 0.5],
      [w / 2 + 1.8, -d / 2 + 0.5, 3.6, -0.4],
      [-w / 2 - 1.5, d / 2 + 1.5, 2.8, 0.6],
      [w / 2 + 2.4, d / 2 + 2.2, 3.4, -0.5],
      [-w / 2 - 3.2, d / 2 - 0.5, 3, 0.3],
    ]
    palms.forEach(([x, z, h, l], i) => {
      const p = palm(h, l, i * 1.3)
      p.position.set(x, -0.05, z)
      scene.add(p)
    })
    ;[[-w / 2 - 1, -d / 2 - 0.2, 0.45], [w / 2 + 1, -d / 2 - 0.4, 0.5], [w / 2 + 1.4, 1, 0.4], [-w / 2 - 1.2, 1.4, 0.4]].forEach(([x, z, s]) => {
      const b = bush(s)
      b.position.set(x, -0.02, z)
      scene.add(b)
    })
    ;[[groundR * 0.85, 2, 0.45], [-groundR * 0.8, 3, 0.35]].forEach(([x, z, s]) => {
      const r = rock(s)
      r.position.set(x, -0.1, z)
      scene.add(r)
    })
  }

  clouds(stage, 5)
  return { setRoof, height: base + H }
}
