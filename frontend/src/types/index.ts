export type Role = 'ORGANIZER' | 'PARTICIPANT'
export type EventStatus = 'OPEN' | 'CLOSED'

export interface AuthResponse {
  id: number
  name: string
  email: string
  role: Role
  token: string
}

export interface EventItem {
  id: number
  name: string
  eventDate: string
  maxCapacity: number
  status: EventStatus
  organizerName: string
  registeredByCurrentUser: boolean
}

export interface EventSummary {
  eventId: number
  eventName: string
  maxCapacity: number
  registeredCount: number
  checkedInCount: number
}

export interface Registration {
  registrationId: number
  eventId: number
  eventName: string
  eventDate: string
  checkedIn: boolean
  registeredAt: string
}

export interface TopEvent {
  eventId: number
  eventName: string
  totalRegistrations: number
}

export interface ApiError {
  timestamp: string
  status: number
  message: string
}
