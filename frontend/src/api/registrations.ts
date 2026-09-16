import client from './client'
import { Registration } from '../types'

export function registerForEvent(eventId: number) {
  return client.post<Registration>(`/events/${eventId}/register`).then((res) => res.data)
}

export function cancelRegistration(eventId: number) {
  return client.delete(`/events/${eventId}/register`)
}

export function checkInToEvent(eventId: number) {
  return client.post<Registration>(`/events/${eventId}/checkin`).then((res) => res.data)
}

export function listMyRegistrations() {
  return client.get<Registration[]>('/registrations/me').then((res) => res.data)
}
