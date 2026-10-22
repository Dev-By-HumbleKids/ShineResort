import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { Stage } from './core'
import { surface, tex } from './textures'

/** Soft-edged box — real-world objects never have razor-sharp corners. */
export function rbox(w: number, h: number, d: number, material: THREE.Material, pos: [number, number, number] = [0, 0, 0], radius = 0.04) {
  const r = Math.min(radius, w / 2.1, h / 2.1, d / 2.1)
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, r), material)
  m.position.set(...pos)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

let leafMat: THREE.MeshStandardMaterial | null = null
const leafMaterial = () =>
  (leafMat ??= new THREE.MeshStandardMaterial({
    map: tex('leaf'),
    alphaTest: 0.45,
    side: THREE.DoubleSide,
    roughness: 0.75,
    color: '#ffffff',
  }))

/** Curved, tapering palm with drooping textured fronds and coconuts. */
export function palm(height = 3, lean = 0.5, rot = 0, s = 1) {
  const g = new THREE.Group()
  const trunkGeo = new THREE.CylinderGeometry(0.075, 0.13, height, 10, 14, true)
  const p = trunkGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) + height / 2
    const t = y / height
    p.setX(i, p.getX(i) + lean * t * t)
    p.setY(i, y)
  }
  trunkGeo.computeVertexNormals()
  const trunkTex = surface('trunk', [1, height * 1.6])
  const trunk = new THREE.Mesh(trunkGeo, trunkTex)
  trunk.castShadow = true
  g.add(trunk)

  const top = new THREE.Vector3(lean, height, 0)
  const fronds = 11
  for (let i = 0; i < fronds; i++) {
    const len = 1.5 + ((i * 37) % 7) / 10
    const geo = new THREE.PlaneGeometry(len, 0.75, 10, 1)
    geo.translate(len / 2, 0, 0)
    const fp = geo.attributes.position as THREE.BufferAttribute
    for (let k = 0; k < fp.count; k++) {
      const x = fp.getX(k)
      fp.setY(k, fp.getY(k))
      fp.setZ(k, -Math.pow(x / len, 2) * len * 0.55) // droop
    }
    geo.computeVertexNormals()
    const frond = new THREE.Mesh(geo, leafMaterial())
    frond.castShadow = true
    frond.position.copy(top)
    frond.rotation.order = 'YXZ'
    frond.rotation.y = (i / fronds) * Math.PI * 2 + ((i * 13) % 5) * 0.08
    frond.rotation.x = -Math.PI / 2 + 0.25 // lie roughly flat, then droop
    frond.rotation.z = 0.35 + ((i * 7) % 4) * 0.08
    g.add(frond)
  }
  const nut = new THREE.MeshStandardMaterial({ color: '#5a4a2c', roughness: 0.6 })
  for (let i = 0; i < 4; i++) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), nut)
    c.position.copy(top).add(new THREE.Vector3(Math.cos(i * 1.6) * 0.1, -0.12, Math.sin(i * 1.6) * 0.1))
    c.castShadow = true
    g.add(c)
  }
  g.rotation.y = rot
  g.scale.setScalar(s)
  return g
}

/** Rounded tropical shrub made from a few overlapping soft blobs. */
export function bush(size = 0.5, tone = '#4f7344') {
  const g = new THREE.Group()
  const m = new THREE.MeshStandardMaterial({ color: tone, roughness: 0.9, map: tex('grass', [2, 2]) })
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(size * (0.7 + (i % 3) * 0.2), 2), m)
    b.position.set(Math.cos(i * 2.1) * size * 0.6, size * 0.45 + (i % 2) * size * 0.2, Math.sin(i * 2.1) * size * 0.5)
    b.scale.y = 0.8
    b.castShadow = true
    b.receiveShadow = true
    g.add(b)
  }
  return g
}

export function rock(size = 0.4) {
  const geo = new THREE.DodecahedronGeometry(size, 1)
  const p = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (0.9 + ((i * 7) % 5) * 0.05), p.getY(i) * 0.6, p.getZ(i))
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#8f8a7e', roughness: 0.95, map: tex('stone', [0.5, 0.5]) }))
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Beach lounger with cushion. */
export function lounger(color = '#f6f1e6') {
  const g = new THREE.Group()
  const wood = surface('wood', [1, 1])
  g.add(rbox(0.5, 0.06, 1.5, wood, [0, 0.18, 0], 0.02))
  for (const [x, z] of [[-0.2, -0.65], [0.2, -0.65], [-0.2, 0.65], [0.2, 0.65]]) g.add(rbox(0.05, 0.18, 0.05, wood, [x, 0.09, z], 0.01))
  const cushion = rbox(0.46, 0.08, 1.0, new THREE.MeshStandardMaterial({ color, roughness: 0.95, map: tex('fabric', [2, 4]) }), [0, 0.25, 0.22], 0.035)
  g.add(cushion)
  const back = rbox(0.46, 0.08, 0.5, cushion.material as THREE.Material, [0, 0.38, -0.5], 0.035)
  back.rotation.x = -0.6
  g.add(back)
  return g
}

/** Canvas parasol. */
export function umbrella(color = '#f3e6cc') {
  const g = new THREE.Group()
  g.add(rbox(0.04, 1.5, 0.04, surface('wood'), [0, 0.75, 0], 0.01))
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.32, 16, 1, true), new THREE.MeshStandardMaterial({ color, roughness: 0.9, side: THREE.DoubleSide, map: tex('fabric', [4, 1]) }))
  top.position.y = 1.55
  top.castShadow = true
  g.add(top)
  return g
}

/** Low path lantern that glows warmly at night (picked up by bloom). */
export function lantern(stage: Stage, pos: [number, number, number], h = 0.45) {
  const g = new THREE.Group()
  g.add(rbox(0.08, h, 0.08, new THREE.MeshStandardMaterial({ color: '#3a2c20', roughness: 0.6 }), [0, h / 2, 0], 0.015))
  const glow = new THREE.MeshStandardMaterial({ color: '#f7e2b5', emissive: '#ffb257', emissiveIntensity: 0, roughness: 0.4 })
  stage.glowMaterials.push(glow)
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12), glow)
  shade.position.y = h + 0.02
  g.add(shade)
  g.position.set(...pos)
  stage.scene.add(g)
  return g
}

/** Warm point light that only exists at night. */
export function nightLight(stage: Stage, pos: [number, number, number], intensity = 6, distance = 6, color = '#ffb867') {
  const l = new THREE.PointLight(color, intensity, distance, 1.8)
  l.position.set(...pos)
  l.visible = false
  stage.nightLights.push(l)
  stage.scene.add(l)
  return l
}

/** Emissive "glass" for windows that light up at night. */
export function windowGlass(stage: Stage) {
  const m = new THREE.MeshStandardMaterial({ color: '#9fc3c4', emissive: '#ffbf72', emissiveIntensity: 0, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.55 })
  m.userData.glow = 0.7
  stage.glowMaterials.push(m)
  return m
}

/** Timber-shingle / thatch hip roof with real overhang thickness. */
export function thatchRoof(w: number, d: number, h: number, overhang = 0.35) {
  const geo = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 3)
  geo.rotateY(Math.PI / 4)
  const m = new THREE.Mesh(geo, surface('thatch', [3, 2], { side: THREE.DoubleSide }))
  m.scale.set(w + overhang * 2, h, d + overhang * 2)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** A traditional longtail boat with painted hull and canopy. */
export function longtail(color = '#2f6f74') {
  const g = new THREE.Group()
  const shape = new THREE.Shape()
  shape.moveTo(-1.4, 0.25)
  shape.quadraticCurveTo(-1.1, -0.05, 0, -0.12)
  shape.quadraticCurveTo(1.1, -0.05, 1.6, 0.45)
  shape.lineTo(1.4, 0.3)
  shape.lineTo(-1.4, 0.3)
  const hullGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2, curveSegments: 10 })
  hullGeo.translate(0, 0, -0.25)
  const hull = new THREE.Mesh(hullGeo, new THREE.MeshStandardMaterial({ color, roughness: 0.55, map: tex('wood', [1, 1]) }))
  hull.castShadow = true
  g.add(hull)
  g.add(rbox(2.6, 0.04, 0.46, surface('deck', [3, 1]), [0, 0.26, 0], 0.01))
  // canopy
  for (const [x, z] of [[-0.6, -0.2], [0.4, -0.2], [-0.6, 0.2], [0.4, 0.2]]) g.add(rbox(0.03, 0.55, 0.03, surface('wood'), [x, 0.55, z], 0.01))
  g.add(rbox(1.2, 0.03, 0.55, new THREE.MeshStandardMaterial({ color: '#d9c8a2', roughness: 0.95, map: tex('fabric', [3, 1]) }), [-0.1, 0.84, 0], 0.01))
  // garland on the prow
  const garland = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 6, 12), new THREE.MeshStandardMaterial({ color: '#e0a3b8', roughness: 0.8 }))
  garland.position.set(1.55, 0.45, 0)
  g.add(garland)
  return g
}
