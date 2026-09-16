import client from './client'
import { EventItem, EventSummary, TopEvent } from '../types'

export interface CreateEventPayload {
  name: string
  eventDate: string
  maxCapacity: number
}

export function listEvents() {
  return client.get<EventItem[]>('/events').then((res) => res.data)
}

export function listMyEvents() {
  return client.get<EventItem[]>('/events/mine').then((res) => res.data)
}

export function createEvent(payload: CreateEventPayload) {
  return client.post<EventItem>('/events', payload).then((res) => res.data)
}

export function getEventSummary(eventId: number) {
  return client.get<EventSummary>(`/events/${eventId}/summary`).then((res) => res.data)
}

export function getTopEvents() {
  return client.get<TopEvent[]>('/events/top').then((res) => res.data)
}
