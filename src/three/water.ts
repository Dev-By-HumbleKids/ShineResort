import * as THREE from 'three'

/**
 * Stylised-but-believable ocean shader:
 *  - layered travelling waves (displacement + analytic normals)
 *  - fresnel sky reflection and a sharp sun / moon glint
 *  - turquoise shallows that fade to deep teal with distance from shore
 *  - animated surf lines that hug the island's irregular outline
 *  - see-through shallows so the sandy seabed shows near the beach
 */
export type IslandShape = { radius: number; wobble: number; seed: number; bevel?: number; yScale?: number }

const vert = /* glsl */ `
uniform float uTime;
uniform vec4 uIsland; // radius, wobble, seed, bevel
uniform float uYScale;
uniform float uHasIsland;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vDist;

float islandDist(vec2 p) {
  if (uHasIsland < 0.5) return 50.0;
  vec2 q = vec2(p.x, -p.y / uYScale);
  float a = atan(q.y, q.x);
  float r = uIsland.x * (1.0 + uIsland.y * sin(a * 3.0 + uIsland.z) * 0.5 + uIsland.y * cos(a * 5.0 + uIsland.z * 2.0) * 0.3) + uIsland.w;
  return length(q) - r;
}

// one travelling wave: returns height in x, d/dx in y, d/dz in z
vec3 wave(vec2 p, vec2 dir, float freq, float amp, float speed) {
  float ph = dot(dir, p) * freq + uTime * speed;
  return vec3(sin(ph) * amp, cos(ph) * amp * freq * dir.x, cos(ph) * amp * freq * dir.y);
}

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  float d = islandDist(world.xz);
  // calmer water right against the shore
  float calm = smoothstep(-0.2, 4.0, d);
  vec3 w = wave(world.xz, normalize(vec2(1.0, 0.35)), 0.55, 0.075, 1.1)
         + wave(world.xz, normalize(vec2(-0.4, 1.0)), 0.9, 0.04, 1.6)
         + wave(world.xz, normalize(vec2(0.8, -0.6)), 1.7, 0.018, 2.3)
         + wave(world.xz, normalize(vec2(-1.0, -0.2)), 2.9, 0.008, 3.1);
  world.y += w.x * calm;
  vNormalW = normalize(vec3(-w.y * calm, 1.0, -w.z * calm));
  vWorld = world.xyz;
  vDist = d;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const frag = /* glsl */ `
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uSky;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uFoamColor;
uniform float uGlint;
uniform float uShallowWidth;
uniform float uLagoon;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vWorld;
varying vec3 vNormalW;
varying float vDist;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec3 N = normalize(vNormalW);
  // fine ripples for sparkle
  vec2 rp = vWorld.xz * 3.0;
  N = normalize(N + vec3(noise(rp + uTime * 0.6) - 0.5, 0.0, noise(rp.yx - uTime * 0.5) - 0.5) * 0.18);
  vec3 V = normalize(cameraPosition - vWorld);

  float depthT = mix(smoothstep(0.0, uShallowWidth, vDist), 0.15 + 0.1 * noise(vWorld.xz * 0.15), uLagoon);
  vec3 water = mix(uShallow, uDeep, depthT);
  // soft caustic shimmer in the shallows
  float caustic = pow(noise(vWorld.xz * 1.6 + uTime * 0.35) * noise(vWorld.xz * 2.3 - uTime * 0.3), 1.5);
  water += caustic * 0.35 * (1.0 - depthT) * uSunColor * 0.6;

  float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 col = mix(water, uSky, fres * 0.65);

  vec3 R = reflect(-uSunDir, N);
  float spec = pow(max(dot(R, V), 0.0), 180.0) * uGlint;
  col += uSunColor * spec * 1.8;

  // surf: a bright edge on the sand plus lines rolling in
  float edge = 1.0 - smoothstep(0.0, 0.45, vDist);
  float bands = smoothstep(0.82, 1.0, sin(vDist * 4.2 - uTime * 1.4) * 0.5 + 0.5) * (1.0 - smoothstep(0.3, 2.4, vDist));
  float foam = clamp(edge + bands * 0.75, 0.0, 1.0) * (0.55 + 0.45 * noise(vWorld.xz * 6.0 + uTime));
  col = mix(col, uFoamColor, foam * step(-0.3, vDist));

  float alpha = mix(0.45, 0.97, smoothstep(0.0, 3.5, vDist + uLagoon * 2.0));
  alpha = max(alpha, foam);

  float fogF = smoothstep(uFogNear, uFogFar, length(vWorld - cameraPosition));
  col = mix(col, uFogColor, fogF);
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

export function createWater(opts: { size?: number; segments?: number; island?: IslandShape; deep?: string; shallow?: string; shallowWidth?: number; lagoon?: boolean }) {
  const size = opts.size ?? 160
  const g = new THREE.PlaneGeometry(size, size, opts.segments ?? 160, opts.segments ?? 160)
  g.rotateX(-Math.PI / 2)
  const isl = opts.island
  const uniforms = {
    uTime: { value: 0 },
    uIsland: { value: new THREE.Vector4(isl?.radius ?? 0, isl?.wobble ?? 0, isl?.seed ?? 0, isl?.bevel ?? 0.5) },
    uYScale: { value: isl?.yScale ?? 0.78 },
    uHasIsland: { value: isl ? 1 : 0 },
    uDeep: { value: new THREE.Color(opts.deep ?? '#0f5866') },
    uShallow: { value: new THREE.Color(opts.shallow ?? '#46c7bd') },
    uSky: { value: new THREE.Color('#bfe0e6') },
    uSunDir: { value: new THREE.Vector3(-0.5, 0.6, 0.6).normalize() },
    uSunColor: { value: new THREE.Color('#fff2d8') },
    uGlint: { value: 1 },
    uFoamColor: { value: new THREE.Color('#f6f8f6') },
    uShallowWidth: { value: opts.shallowWidth ?? 9 },
    uLagoon: { value: opts.lagoon ? 1 : 0 },
    uFogColor: { value: new THREE.Color('#dfe9e8') },
    uFogNear: { value: 60 },
    uFogFar: { value: 160 },
  }
  const material = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false })
  const mesh = new THREE.Mesh(g, material)
  mesh.renderOrder = 2
  mesh.onBeforeRender = (_r, scene) => {
    const f = scene.fog as THREE.Fog | null
    if (f) {
      uniforms.uFogColor.value.copy(f.color)
      uniforms.uFogNear.value = f.near
      uniforms.uFogFar.value = f.far
    }
  }
  return {
    mesh,
    update(t: number) {
      uniforms.uTime.value = t
    },
    setLight(night: boolean, sunDir: THREE.Vector3) {
      uniforms.uSunDir.value.copy(sunDir).normalize()
      uniforms.uSunColor.value.set(night ? '#c9d8ff' : '#fff2d8')
      uniforms.uSky.value.set(night ? '#14303a' : '#bfe0e6')
      uniforms.uDeep.value.set(night ? '#06262e' : opts.deep ?? '#0f5866')
      uniforms.uShallow.value.set(night ? '#14535a' : opts.shallow ?? '#46c7bd')
      uniforms.uGlint.value = night ? 0.6 : 1
      uniforms.uFoamColor.value.set(night ? '#3f5a63' : '#f6f8f6')
    },
  }
}
