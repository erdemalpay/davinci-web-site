import { useMutation, useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export type HourAvailability = { hour: string; remaining: number; pending: number }
export type DayAvailability = { date: string; open: string; close: string; hours: HourAvailability[] }
export type Availability = { capacity: number; days: DayAvailability[] }

export type GroupEventType = 'corporate' | 'birthday' | 'school_club' | 'tournament' | 'other'

export type GroupEventApplication = {
  organization: string
  contactName: string
  phone: string
  email: string
  participantCount: number
  date: string
  startTime: string
  endTime: string
  eventType: GroupEventType
  wantsGameMaster?: boolean
  gamePreferences?: string
  wantsFood?: boolean
  foodRequest?: string
  budgetPerPerson?: number
  needsInvoice?: boolean
  invoiceTitle?: string
  taxOffice?: string
  taxNumber?: string
  notes?: string
  website?: string
}

async function fetchAvailability(): Promise<Availability> {
  const res = await fetch(`${API_URL}/group-events/public/availability`)
  if (!res.ok) throw new Error('Failed to fetch availability')
  return res.json()
}

export function useGroupEventAvailability(enabled: boolean) {
  return useQuery({
    queryKey: ['groupEvents', 'availability'],
    queryFn: fetchAvailability,
    enabled,
    staleTime: 30_000,
  })
}

export class ApplyError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function postApplication(application: GroupEventApplication) {
  const res = await fetch(`${API_URL}/group-events/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new ApplyError(message || 'Application failed', res.status)
  }
  return res.json()
}

export function useApplyGroupEvent() {
  return useMutation({ mutationFn: postApplication })
}
