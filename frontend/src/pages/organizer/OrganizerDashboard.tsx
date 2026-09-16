import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createEvent, listMyEvents } from '../../api/events'
import { getErrorMessage } from '../../api/client'
import { EventItem } from '../../types'

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [maxCapacity, setMaxCapacity] = useState(50)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function loadEvents() {
    setLoading(true)
    try {
      const data = await listMyEvents()
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await createEvent({ name, eventDate, maxCapacity })
      setName('')
      setEventDate('')
      setMaxCapacity(50)
      await loadEvents()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Organizer Dashboard</h1>
        <h2>Create a new event</h2>
        {formError && <p className="error-banner">{formError}</p>}
        <form onSubmit={handleCreate}>
          <label>
            Event name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Event date
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </label>
          <label>
            Maximum capacity
            <input
              type="number"
              min={1}
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Your events</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-banner">{error}</p>}
        {!loading && events.length === 0 && <p>You haven't created any events yet.</p>}
        {!loading && events.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Capacity</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.maxCapacity}</td>
                  <td>
                    <span className={`badge ${event.status === 'OPEN' ? 'open' : 'closed'}`}>{event.status}</span>
                  </td>
                  <td>
                    <Link to={`/organizer/events/${event.id}/summary`}>View Summary</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <Link to="/organizer/top-events">View top events by registration</Link>
      </div>
    </div>
  )
}
