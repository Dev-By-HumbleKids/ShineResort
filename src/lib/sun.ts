/**
 * Approximate sunrise / sunset for Ngwe Saung using the NOAA solar equations.
 * Accurate to a few minutes — good enough for an informational hero detail.
 */
const LAT = 16.86
const LNG = 94.39
const TZ_MIN = 6.5 * 60 // Myanmar Time, UTC+6:30

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

export function sunTimes(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const n = Math.floor((date.getTime() - start) / 86_400_000)
  const g = ((2 * Math.PI) / 365) * (n - 1)
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g)
  const ha = deg(Math.acos(Math.cos(rad(90.833)) / (Math.cos(rad(LAT)) * Math.cos(decl)) - Math.tan(rad(LAT)) * Math.tan(decl)))
  const toLocal = (utcMin: number) => {
    const m = (((utcMin + TZ_MIN) % 1440) + 1440) % 1440
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`
  }
  return {
    sunrise: toLocal(720 - 4 * (LNG + ha) - eqTime),
    sunset: toLocal(720 - 4 * (LNG - ha) - eqTime),
  }
}

export function localTime(date = new Date()) {
  return date.toLocaleTimeString('en-GB', { timeZone: 'Asia/Yangon', hour: '2-digit', minute: '2-digit' })
}
