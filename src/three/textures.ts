import * as THREE from 'three'

/**
 * Procedural canvas textures (no image downloads) for sand, timber, thatch,
 * plaster, stone, grass, palm trunks and leaves. Generated once and cached.
 */
type Kind = 'sand' | 'wood' | 'deck' | 'thatch' | 'plaster' | 'stone' | 'grass' | 'trunk' | 'leaf' | 'fabric' | 'tile'

let seed = 7
const rnd = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

function canvas(size = 512) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  return [c, c.getContext('2d')!] as const
}

function speckle(ctx: CanvasRenderingContext2D, size: number, n: number, colors: string[], r: [number, number]) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colors[(rnd() * colors.length) | 0]
    ctx.globalAlpha = 0.25 + rnd() * 0.5
    const s = r[0] + rnd() * (r[1] - r[0])
    ctx.fillRect(rnd() * size, rnd() * size, s, s)
  }
  ctx.globalAlpha = 1
}

const draw: Record<Kind, () => HTMLCanvasElement> = {
  sand() {
    const [c, x] = canvas()
    x.fillStyle = '#d9c095'
    x.fillRect(0, 0, 512, 512)
    // wind ripples
    x.globalAlpha = 0.08
    for (let i = 0; i < 40; i++) {
      x.strokeStyle = i % 2 ? '#c8b089' : '#fff6e2'
      x.lineWidth = 3 + rnd() * 4
      x.beginPath()
      const y = rnd() * 512
      x.moveTo(0, y)
      for (let k = 0; k <= 512; k += 32) x.lineTo(k, y + Math.sin(k * 0.03 + i) * 6)
      x.stroke()
    }
    x.globalAlpha = 1
    speckle(x, 512, 9000, ['#c2a578', '#ead9b8', '#a88b62', '#f4ead6'], [1, 2.2])
    return c
  },
  wood() {
    const [c, x] = canvas()
    x.fillStyle = '#8a6545'
    x.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 260; i++) {
      x.strokeStyle = rnd() > 0.5 ? 'rgba(60,38,22,0.35)' : 'rgba(180,140,100,0.25)'
      x.lineWidth = 0.6 + rnd() * 1.8
      x.beginPath()
      const y = rnd() * 512
      x.moveTo(0, y)
      x.bezierCurveTo(170, y + rnd() * 10 - 5, 340, y + rnd() * 10 - 5, 512, y + rnd() * 6 - 3)
      x.stroke()
    }
    return c
  },
  deck() {
    const [c, x] = canvas()
    const planks = 8
    for (let i = 0; i < planks; i++) {
      const l = 38 + rnd() * 14
      x.fillStyle = `hsl(28 ${32 + rnd() * 10}% ${l}%)`
      x.fillRect(0, (i * 512) / planks, 512, 512 / planks)
      for (let k = 0; k < 30; k++) {
        x.strokeStyle = 'rgba(50,30,15,0.25)'
        x.lineWidth = 0.7
        x.beginPath()
        const y = (i * 512) / planks + rnd() * (512 / planks)
        x.moveTo(0, y)
        x.lineTo(512, y + rnd() * 4 - 2)
        x.stroke()
      }
      x.fillStyle = 'rgba(30,18,10,0.6)'
      x.fillRect(0, (i * 512) / planks, 512, 2.5)
      x.fillRect(rnd() * 512, (i * 512) / planks, 2.5, 512 / planks)
    }
    return c
  },
  thatch() {
    const [c, x] = canvas()
    x.fillStyle = '#7a6142'
    x.fillRect(0, 0, 512, 512)
    for (let row = 0; row < 16; row++) {
      for (let i = 0; i < 220; i++) {
        const px = rnd() * 512
        const py = row * 32 + rnd() * 8
        x.strokeStyle = ['#9c7f55', '#b89767', '#6b5236', '#cdb07c'][(rnd() * 4) | 0]
        x.globalAlpha = 0.7
        x.lineWidth = 1 + rnd()
        x.beginPath()
        x.moveTo(px, py)
        x.lineTo(px + rnd() * 6 - 3, py + 26 + rnd() * 10)
        x.stroke()
      }
      x.globalAlpha = 0.35
      x.fillStyle = '#3d2c1b'
      x.fillRect(0, row * 32 + 30, 512, 3)
    }
    x.globalAlpha = 1
    return c
  },
  plaster() {
    const [c, x] = canvas()
    x.fillStyle = '#e4d9c6'
    x.fillRect(0, 0, 512, 512)
    // very fine trowel texture only — no blotches
    speckle(x, 512, 2200, ['#d9cdb8', '#f3ecdf'], [1, 1.4])
    return c
  },
  stone() {
    const [c, x] = canvas()
    x.fillStyle = '#cbbfa8'
    x.fillRect(0, 0, 512, 512)
    // laid stone slabs
    for (let r = 0; r < 6; r++) {
      let px = -rnd() * 60
      while (px < 512) {
        const w = 70 + rnd() * 90
        x.fillStyle = `hsl(36 ${14 + rnd() * 10}% ${70 + rnd() * 10}%)`
        x.fillRect(px + 2, r * 86 + 2, w - 4, 82)
        px += w
      }
    }
    speckle(x, 512, 5000, ['#a99d86', '#e8e0cf'], [1, 2])
    return c
  },
  grass() {
    const [c, x] = canvas()
    x.fillStyle = '#6d8b55'
    x.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 14000; i++) {
      x.strokeStyle = ['#7f9e62', '#5a7748', '#93ad6d', '#4e6a40'][(rnd() * 4) | 0]
      x.globalAlpha = 0.6
      const px = rnd() * 512
      const py = rnd() * 512
      x.beginPath()
      x.moveTo(px, py)
      x.lineTo(px + rnd() * 2 - 1, py - 3 - rnd() * 4)
      x.stroke()
    }
    x.globalAlpha = 1
    return c
  },
  trunk() {
    const [c, x] = canvas(256)
    x.fillStyle = '#8c7155'
    x.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 18; i++) {
      const y = i * 14.2
      x.fillStyle = 'rgba(70,52,36,0.6)'
      x.fillRect(0, y, 256, 3 + rnd() * 2)
      x.fillStyle = 'rgba(190,165,130,0.25)'
      x.fillRect(0, y + 5, 256, 2)
    }
    speckle(x, 256, 1500, ['#6f5640', '#a88c6c'], [1, 2])
    return c
  },
  leaf() {
    // a single palm frond: midrib + leaflets on a transparent background
    const [c, x] = canvas(512)
    x.clearRect(0, 0, 512, 512)
    x.lineCap = 'round'
    for (let i = 0; i < 46; i++) {
      const t = i / 46
      const px = 20 + t * 470
      const len = Math.sin(t * Math.PI) * 120 + 20
      for (const side of [-1, 1]) {
        x.strokeStyle = ['#3f6b3a', '#4f7d42', '#5d8c4b', '#36602f'][(rnd() * 4) | 0]
        x.lineWidth = 7 - t * 4
        x.beginPath()
        x.moveTo(px, 256)
        x.quadraticCurveTo(px + 24, 256 + side * len * 0.45, px + 44, 256 + side * len)
        x.stroke()
      }
    }
    x.strokeStyle = '#6f8a45'
    x.lineWidth = 6
    x.beginPath()
    x.moveTo(10, 256)
    x.lineTo(500, 256)
    x.stroke()
    return c
  },
  fabric() {
    const [c, x] = canvas(256)
    x.fillStyle = '#f6f1e6'
    x.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 256; i += 3) {
      x.fillStyle = 'rgba(200,190,170,0.18)'
      x.fillRect(i, 0, 1, 256)
      x.fillRect(0, i, 256, 1)
    }
    return c
  },
  tile() {
    const [c, x] = canvas(256)
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++) {
        x.fillStyle = `hsl(184 ${45 + rnd() * 15}% ${58 + rnd() * 10}%)`
        x.fillRect(i * 32, j * 32, 32, 32)
        x.fillStyle = 'rgba(255,255,255,0.7)'
        x.fillRect(i * 32, j * 32, 32, 1.5)
        x.fillRect(i * 32, j * 32, 1.5, 32)
      }
    return c
  },
}

const canvases = new Map<Kind, HTMLCanvasElement>()
const textures = new Map<string, THREE.CanvasTexture>()

export function tex(kind: Kind, repeat: [number, number] = [1, 1]) {
  const key = `${kind}:${repeat.join('x')}`
  let t = textures.get(key)
  if (!t) {
    let cv = canvases.get(kind)
    if (!cv) {
      seed = 7 + kind.length * 31
      cv = draw[kind]()
      canvases.set(kind, cv)
    }
    t = new THREE.CanvasTexture(cv)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(...repeat)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    textures.set(key, t)
  }
  return t
}

const mats = new Map<string, THREE.MeshStandardMaterial>()

/** Textured physically-based material with a matching bump map. */
export function surface(kind: Kind, repeat: [number, number] = [1, 1], opts: THREE.MeshStandardMaterialParameters = {}) {
  const key = `${kind}:${repeat.join('x')}:${JSON.stringify(opts)}`
  let m = mats.get(key)
  if (!m) {
    const map = tex(kind, repeat)
    const rough: Partial<Record<Kind, number>> = { sand: 0.95, wood: 0.7, deck: 0.75, thatch: 1, plaster: 0.9, stone: 0.85, grass: 1, trunk: 0.95, fabric: 0.95, tile: 0.25 }
    const bump: Partial<Record<Kind, number>> = { plaster: 0.12, fabric: 0.2, tile: 0.2 }
    m = new THREE.MeshStandardMaterial({ map, bumpMap: map, bumpScale: bump[kind] ?? 0.6, roughness: rough[kind] ?? 0.8, ...opts })
    mats.set(key, m)
  }
  return m
}

export function clearSurfaces() {
  mats.forEach((m) => m.dispose())
  mats.clear()
  textures.forEach((t) => t.dispose())
  textures.clear()
}
