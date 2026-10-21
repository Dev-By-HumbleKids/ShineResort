import { useId } from 'react'
import type { Guest } from '../../lib/reservations'
import { Field } from '../ui/bits'

export type GuestErrors = Partial<Record<keyof Guest, string>>

export const emptyGuest: Guest = { firstName: '', lastName: '', email: '', phone: '', requests: '' }

export function validateGuest(g: Guest): GuestErrors {
  const e: GuestErrors = {}
  if (!g.firstName.trim()) e.firstName = 'Please enter a first name.'
  if (!g.lastName.trim()) e.lastName = 'Please enter a last name.'
  if (!g.email.trim()) e.email = 'Please enter an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) e.email = 'That email address doesn’t look right.'
  if (g.phone && !/^[+()\d\s-]{6,20}$/.test(g.phone.trim())) e.phone = 'Use digits, spaces, + or - only.'
  if ((g.requests ?? '').length > 500) e.requests = 'Please keep requests under 500 characters.'
  return e
}

/** Shared contact-details block used by every reservation form. */
export function GuestFields({
  value,
  onChange,
  errors,
  requestsLabel = 'Special requests (optional)',
}: {
  value: Guest
  onChange: (g: Guest) => void
  errors: GuestErrors
  requestsLabel?: string
}) {
  const id = useId()
  const bind = (k: keyof Guest) => ({
    id: `${id}-${k}`,
    value: value[k] ?? '',
    onChange: (e: { target: { value: string } }) => onChange({ ...value, [k]: e.target.value }),
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `${id}-${k}-error` : undefined,
    className: 'field',
  })
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-3 font-serif text-2xl">Guest details</legend>
      <Field id={`${id}-firstName`} label="First name" error={errors.firstName}>
        <input {...bind('firstName')} autoComplete="given-name" required />
      </Field>
      <Field id={`${id}-lastName`} label="Last name" error={errors.lastName}>
        <input {...bind('lastName')} autoComplete="family-name" required />
      </Field>
      <Field id={`${id}-email`} label="Email" error={errors.email}>
        <input {...bind('email')} type="email" autoComplete="email" inputMode="email" required />
      </Field>
      <Field id={`${id}-phone`} label="Phone (optional)" error={errors.phone}>
        <input {...bind('phone')} type="tel" autoComplete="tel" inputMode="tel" />
      </Field>
      <Field id={`${id}-requests`} label={requestsLabel} error={errors.requests} className="sm:col-span-2">
        <textarea {...bind('requests')} rows={3} maxLength={500} />
      </Field>
    </fieldset>
  )
}
