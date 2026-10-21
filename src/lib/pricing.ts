import type { AddOn, ExperiencePackage } from '../data/types'

/** Sample fees used across the demo. Clearly labelled as illustrative. */
export const SERVICE_RATE = 0.1
export const TAX_RATE = 0.05

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export type Line = { label: string; amount: number; hint?: string }

export function withFees(lines: Line[]) {
  const subtotal = lines.reduce((s, l) => s + l.amount, 0)
  const service = Math.round(subtotal * SERVICE_RATE)
  const tax = Math.round((subtotal + service) * TAX_RATE)
  return { lines, subtotal, service, tax, total: subtotal + service + tax }
}

export type Totals = ReturnType<typeof withFees>

export const roomExtras = [
  { id: 'transfer', name: 'Private transfer from Pathein airport', price: 140 },
  { id: 'boat-arrival', name: 'Arrive by private boat', price: 220 },
  { id: 'late-checkout', name: 'Late check-out until 18:00', price: 90 },
  { id: 'floating-breakfast', name: 'Floating breakfast (once)', price: 75 },
  { id: 'romance', name: 'Romantic turndown with petals', price: 65 },
] as const

export function experienceLines(pkg: ExperiencePackage, guests: number, addOns: AddOn[]): Line[] {
  const lines: Line[] = [
    pkg.per === 'person'
      ? { label: pkg.name, amount: pkg.price * guests, hint: `${money(pkg.price)} × ${guests} guest${guests > 1 ? 's' : ''}` }
      : { label: pkg.name, amount: pkg.price, hint: 'Per group' },
  ]
  for (const a of addOns) {
    lines.push(
      a.per === 'person'
        ? { label: a.name, amount: a.price * guests, hint: `${money(a.price)} × ${guests}` }
        : { label: a.name, amount: a.price },
    )
  }
  return lines
}
