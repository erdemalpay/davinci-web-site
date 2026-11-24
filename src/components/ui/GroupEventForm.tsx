import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ApplyError,
  useApplyGroupEvent,
  useGroupEventAvailability,
} from '../../utils/api/groupEvent/groupEvent'
import type { DayAvailability, GroupEventApplication, GroupEventType } from '../../utils/api/groupEvent/groupEvent'

// Group event application: the group tells us about itself, then picks a day
// and hours from the cafe's availability. Opens as a popup in the middle of the site.

export const GROUP_EVENT_HASH = '#grup-etkinligi'

const GroupEventContext = createContext<() => void>(() => {})
export const useOpenGroupEventForm = () => useContext(GroupEventContext)

type Info = {
  organization: string
  contactName: string
  phone: string
  email: string
  participantCount: string
  eventType: GroupEventType | ''
  wantsGameMaster: boolean
  gamePreferences: string
  wantsFood: boolean
  foodRequest: string
  budgetPerPerson: string
  needsInvoice: boolean
  invoiceTitle: string
  taxOffice: string
  taxNumber: string
  notes: string
  website: string
}

const EMPTY: Info = {
  organization: '', contactName: '', phone: '', email: '', participantCount: '',
  eventType: '', wantsGameMaster: false, gamePreferences: '', wantsFood: false,
  foodRequest: '', budgetPerPerson: '', needsInvoice: false, invoiceTitle: '',
  taxOffice: '', taxNumber: '', notes: '', website: '',
}

const EVENT_TYPES: { value: GroupEventType; label: string }[] = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'school_club', label: 'School / Club' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'other', label: 'Other' },
]

const toMin = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
const fromMin = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

function infoErrors(info: Info): Partial<Record<keyof Info, string>> {
  const errors: Partial<Record<keyof Info, string>> = {}
  if (info.organization.trim().length < 2) errors.organization = 'Required'
  if (info.contactName.trim().length < 2) errors.contactName = 'Required'
  if (info.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid phone number'
  if (!/^\S+@\S+\.\S+$/.test(info.email.trim())) errors.email = 'Enter a valid email'
  const count = Number(info.participantCount)
  if (!Number.isInteger(count) || count < 1 || count > 100) errors.participantCount = 'Between 1 and 100'
  if (!info.eventType) errors.eventType = 'Required'
  if (info.needsInvoice && !info.invoiceTitle.trim()) errors.invoiceTitle = 'Required'
  if (info.needsInvoice && !info.taxNumber.trim()) errors.taxNumber = 'Required'
  return errors
}

const inputStyle: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--gray-300)',
  fontSize: '0.95rem', fontFamily: 'var(--font-body)', color: 'var(--black)', background: '#fff',
  boxSizing: 'border-box',
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' }}>
      {label}
      {children}
      {error && <span style={{ color: 'var(--red)', fontWeight: 500, fontSize: '0.78rem' }}>{t(error)}</span>}
    </label>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, color: 'var(--black)', fontSize: '0.92rem' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--red)' }} />
      {label}
    </label>
  )
}

const primaryButton: CSSProperties = {
  background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '100px', padding: '12px 26px',
  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
}
const secondaryButton: CSSProperties = {
  ...primaryButton, background: 'transparent', color: 'var(--gray-700)', border: '1px solid var(--gray-300)',
}

function InfoStep({ info, setInfo, onNext }: { info: Info; setInfo: (i: Info) => void; onNext: () => void }) {
  const { t } = useTranslation()
  const [touched, setTouched] = useState(false)
  const errors = touched ? infoErrors(info) : {}
  const set = <K extends keyof Info>(key: K, value: Info[K]) => setInfo({ ...info, [key]: value })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        if (Object.keys(infoErrors(info)).length === 0) onNext()
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <div className="ge-grid">
        <Field label={t('Group / organization name')} error={errors.organization}>
          <input style={inputStyle} value={info.organization} onChange={(e) => set('organization', e.target.value)} />
        </Field>
        <Field label={t('Event type')} error={errors.eventType}>
          <select style={inputStyle} value={info.eventType} onChange={(e) => set('eventType', e.target.value as GroupEventType)}>
            <option value="">{t('Select')}</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{t(type.label)}</option>
            ))}
          </select>
        </Field>
        <Field label={t('Contact person')} error={errors.contactName}>
          <input style={inputStyle} value={info.contactName} autoComplete="name" onChange={(e) => set('contactName', e.target.value)} />
        </Field>
        <Field label={t('Number of people')} error={errors.participantCount}>
          <input style={inputStyle} type="number" min={1} max={100} inputMode="numeric" value={info.participantCount} onChange={(e) => set('participantCount', e.target.value)} />
        </Field>
        <Field label={t('Phone')} error={errors.phone}>
          <input style={inputStyle} type="tel" autoComplete="tel" value={info.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label={t('Email')} error={errors.email}>
          <input style={inputStyle} type="email" autoComplete="email" value={info.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', background: 'var(--gray-50)', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
        <Toggle checked={info.wantsGameMaster} onChange={(v) => set('wantsGameMaster', v)} label={t('We would like a game master to teach games')} />
        {info.wantsGameMaster && (
          <input style={inputStyle} placeholder={t('What kind of games? (e.g. party games, strategy, specific titles)')} value={info.gamePreferences} onChange={(e) => set('gamePreferences', e.target.value)} />
        )}
        <Toggle checked={info.wantsFood} onChange={(v) => set('wantsFood', v)} label={t('We would like food and drinks')} />
        {info.wantsFood && (
          <div className="ge-grid">
            <input style={inputStyle} placeholder={t('What would you like? (e.g. snacks, drinks, cake)')} value={info.foodRequest} onChange={(e) => set('foodRequest', e.target.value)} />
            <input style={inputStyle} type="number" min={0} inputMode="numeric" placeholder={t('Budget per person (₺)')} value={info.budgetPerPerson} onChange={(e) => set('budgetPerPerson', e.target.value)} />
          </div>
        )}
        <Toggle checked={info.needsInvoice} onChange={(v) => set('needsInvoice', v)} label={t('We need a corporate invoice')} />
        {info.needsInvoice && (
          <div className="ge-grid">
            <Field label={t('Company title')} error={errors.invoiceTitle}>
              <input style={inputStyle} value={info.invoiceTitle} onChange={(e) => set('invoiceTitle', e.target.value)} />
            </Field>
            <Field label={t('Tax office')}>
              <input style={inputStyle} value={info.taxOffice} onChange={(e) => set('taxOffice', e.target.value)} />
            </Field>
            <Field label={t('Tax / ID number')} error={errors.taxNumber}>
              <input style={inputStyle} inputMode="numeric" value={info.taxNumber} onChange={(e) => set('taxNumber', e.target.value)} />
            </Field>
          </div>
        )}
      </div>

      <Field label={t('Anything else we should know? (optional)')}>
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={info.notes} onChange={(e) => set('notes', e.target.value)} />
      </Field>

      {/* Honeypot: hidden from people, bots fill it */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={info.website} onChange={(e) => set('website', e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" style={primaryButton}>{t('Next: choose date and time')} →</button>
      </div>
    </form>
  )
}

function dayLabel(date: string, locale: string) {
  const d = new Date(`${date}T00:00:00Z`)
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...o }).format(d)
  return { weekday: fmt({ weekday: 'short' }), day: fmt({ day: 'numeric', month: 'short' }) }
}

// Fewest free seats in any hour from start to end.
function leastFree(day: DayAvailability, start: string, end: string) {
  const inRange = day.hours.filter((h) => toMin(h.hour) >= toMin(start) && toMin(h.hour) < toMin(end))
  return inRange.length ? Math.min(...inRange.map((h) => h.remaining)) : Infinity
}

function TimeStep({
  count, onBack, onSubmit, submitting, error,
}: {
  count: number
  onBack: () => void
  onSubmit: (date: string, start: string, end: string) => void
  submitting: boolean
  error: string | null
}) {
  const { t, i18n } = useTranslation()
  const { data, isLoading, isError } = useGroupEventAvailability(true)
  const [date, setDate] = useState<string | null>(null)
  const [start, setStart] = useState<string | null>(null)
  const [end, setEnd] = useState<string | null>(null)
  const locale = i18n.language === 'en' ? 'en-GB' : 'tr-TR'

  const days = data?.days ?? []
  // Full days and hours can still be chosen; they are only marked
  const fits = (day: DayAvailability) => day.hours.some((h) => h.remaining >= count)
  const day = days.find((d) => d.date === date) ?? null
  const endOptions = useMemo(() => {
    if (!day || !start) return []
    const options: string[] = []
    for (let m = toMin(start) + 60; m <= toMin(day.close); m += 60) options.push(fromMin(m))
    return options
  }, [day, start])
  const tooFull = Boolean(day && start && end && leastFree(day, start, end) < count)

  const pickStart = (hour: string) => {
    if (!day) return
    setStart(hour)
    const window = toMin(day.close) - toMin(day.open)
    // Default: the whole weekend window, otherwise 3 hours
    const wanted = toMin(hour) + (window <= 240 ? window : 180)
    setEnd(fromMin(Math.min(wanted, toMin(day.close))))
  }

  if (isLoading) return <p style={{ color: 'var(--gray-600)' }}>{t('Loading...')}</p>
  if (isError) return <p style={{ color: 'var(--red)' }}>{t('Availability could not be loaded. Please try again or call us.')}</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <p style={{ margin: 0, color: 'var(--gray-700)', fontSize: '0.92rem' }}>
        {t('We can host up to {{capacity}} people at the same time. On weekdays events can start between 12:00 and 22:00; on weekends they run between 10:00 and 14:00. Days and hours without room for {{count}} people are marked in orange; you can still apply for them.', { capacity: data?.capacity ?? 100, count })}
      </p>

      <div className="ge-days">
        {days.map((d) => {
          const ok = fits(d)
          const selected = d.date === date
          const { weekday, day: label } = dayLabel(d.date, locale)
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => { setDate(d.date); setStart(null); setEnd(null) }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 4px',
                borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                border: selected ? '2px solid var(--red)' : ok ? '1px solid var(--gray-300)' : '1px solid #F6AD55',
                background: selected ? 'var(--red-muted)' : ok ? '#fff' : '#FFF7ED',
                color: 'var(--black)',
              }}
            >
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>{weekday}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{label}</span>
            </button>
          )
        })}
      </div>

      {day && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <strong style={{ color: 'var(--black)' }}>{t('Choose a start hour')} ({day.open} - {day.lastStart ?? day.close})</strong>
          <div className="ge-hours">
            {day.hours.filter((h) => !day.lastStart || toMin(h.hour) <= toMin(day.lastStart)).map((h) => {
              const ok = h.remaining >= count
              const inRange = start && end && toMin(h.hour) >= toMin(start) && toMin(h.hour) < toMin(end)
              return (
                <button
                  key={h.hour}
                  type="button"
                  onClick={() => pickStart(h.hour)}
                  title={h.pending ? t('{{count}} people waiting for approval at this hour', { count: h.pending }) : undefined}
                  style={{
                    padding: '8px 4px', borderRadius: '10px', fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    border: inRange ? '2px solid var(--red)' : ok ? '1px solid var(--gray-300)' : '1px solid #F6AD55',
                    background: inRange ? 'var(--red-muted)' : ok ? '#fff' : '#FFF7ED',
                    color: 'var(--black)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{h.hour}</span>
                  <span style={{ fontSize: '0.72rem', color: ok ? 'var(--gray-600)' : '#C05621' }}>
                    {t('{{count}} free', { count: h.remaining })}
                  </span>
                </button>
              )
            })}
          </div>

          {start && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600 }}>{t('End time')}</span>
              <select style={{ ...inputStyle, width: 'auto' }} value={end ?? ''} onChange={(e) => setEnd(e.target.value)}>
                {endOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {tooFull && start && end && (
        <p style={{ margin: 0, padding: '12px 14px', borderRadius: '10px', background: '#FFF7ED', border: '1px solid #F6AD55', color: '#9C4221', fontSize: '0.9rem', lineHeight: 1.5 }}>
          ⚠️ {t('There is not enough room for {{count}} people between {{start}} and {{end}}, so your request may be declined. You can still send it or choose another time.', { count, start, end })}
        </p>
      )}

      {error && <p style={{ margin: 0, color: 'var(--red)', fontWeight: 600 }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <button type="button" style={secondaryButton} onClick={onBack}>← {t('Back')}</button>
        <button
          type="button"
          disabled={!date || !start || !end || submitting}
          onClick={() => date && start && end && onSubmit(date, start, end)}
          style={{ ...primaryButton, opacity: !date || !start || !end || submitting ? 0.5 : 1 }}
        >
          {submitting ? t('Sending...') : t('Send application')}
        </button>
      </div>
    </div>
  )
}

export function GroupEventFormProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'info' | 'time' | 'done'>('info')
  const [info, setInfo] = useState<Info>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const apply = useApplyGroupEvent()
  const availability = useGroupEventAvailability(open && step === 'time')

  const show = useCallback(() => {
    setError(null)
    setStep((s) => (s === 'done' ? 'info' : s))
    setOpen(true)
  }, [])
  const close = useCallback(() => {
    setOpen(false)
    if (step === 'done') {
      setInfo(EMPTY)
      setStep('info')
    }
    if (window.location.hash === GROUP_EVENT_HASH) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [step])

  // davinciboardgame.com/#grup-etkinligi opens the form directly (shareable link)
  useEffect(() => {
    const check = () => { if (window.location.hash === GROUP_EVENT_HASH) show() }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [show])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const submit = (date: string, startTime: string, endTime: string) => {
    setError(null)
    const application: GroupEventApplication = {
      organization: info.organization.trim(),
      contactName: info.contactName.trim(),
      phone: info.phone.trim(),
      email: info.email.trim(),
      participantCount: Number(info.participantCount),
      eventType: info.eventType as GroupEventType,
      date, startTime, endTime,
      wantsGameMaster: info.wantsGameMaster,
      gamePreferences: info.wantsGameMaster ? info.gamePreferences.trim() || undefined : undefined,
      wantsFood: info.wantsFood,
      foodRequest: info.wantsFood ? info.foodRequest.trim() || undefined : undefined,
      budgetPerPerson: info.wantsFood && info.budgetPerPerson ? Number(info.budgetPerPerson) : undefined,
      needsInvoice: info.needsInvoice,
      invoiceTitle: info.needsInvoice ? info.invoiceTitle.trim() : undefined,
      taxOffice: info.needsInvoice ? info.taxOffice.trim() || undefined : undefined,
      taxNumber: info.needsInvoice ? info.taxNumber.trim() : undefined,
      notes: info.notes.trim() || undefined,
      website: info.website || undefined,
    }
    apply.mutate(application, {
      onSuccess: () => setStep('done'),
      onError: (err) => {
        if (err instanceof ApplyError && err.status === 409) {
          setError(t('Those hours just filled up. Please choose another time.'))
          availability.refetch()
        } else {
          setError(t('Your application could not be sent. Please try again or call us at 0312 286 78 60.'))
        }
      },
    })
  }

  const title = step === 'done' ? t('Application received') : t('Group Event Application')
  const stepLabel = step === 'info' ? t('Step 1 of 2: About your group') : step === 'time' ? t('Step 2 of 2: Date and time') : ''

  return (
    <GroupEventContext.Provider value={show}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            key="group-event-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="embed-overlay"
            style={{
              position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="embed-panel"
              style={{
                width: 'min(780px, 94vw)', maxHeight: '90vh', background: '#fff', borderRadius: '18px',
                overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 16px 14px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--black)' }}>{title}</div>
                  {stepLabel && <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '2px' }}>{stepLabel}</div>}
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('Close')}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#111" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div style={{ padding: '20px 24px 24px', overflowY: 'auto', position: 'relative' }}>
                {step === 'info' && <InfoStep info={info} setInfo={setInfo} onNext={() => setStep('time')} />}
                {step === 'time' && (
                  <TimeStep
                    count={Number(info.participantCount)}
                    onBack={() => setStep('info')}
                    onSubmit={submit}
                    submitting={apply.isPending}
                    error={error}
                  />
                )}
                {step === 'done' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>
                      {t('Thank you! We have received your application and sent a confirmation to {{email}}. Our team will review it and let you know by email. Your time is reserved once we approve it.', { email: info.email })}
                    </p>
                    <button type="button" style={primaryButton} onClick={close}>{t('Close')}</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .ge-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 16px; }
        .ge-days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; max-height: 240px; overflow-y: auto; padding: 2px; }
        .ge-hours { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
        @media (max-width: 640px) {
          .ge-grid { grid-template-columns: 1fr; }
          .ge-days { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .ge-hours { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>
    </GroupEventContext.Provider>
  )
}
