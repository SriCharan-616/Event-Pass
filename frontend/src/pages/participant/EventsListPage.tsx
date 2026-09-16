import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents } from '../../api/events'
import { registerForEvent } from '../../api/registrations'
import { getErrorMessage } from '../../api/client'
import { EventItem } from '../../types'

export default function EventsListPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registeringId, setRegisteringId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadEvents() {
    setLoading(true)
    try {
      const data = await listEvents()
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

  async function handleRegister(eventId: number) {
    setRegisteringId(eventId)
    setMessage(null)
    setError(null)
    try {
      await registerForEvent(eventId)
      setMessage('Registered successfully!')
      await loadEvents()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setRegisteringId(null)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Browse Events</h1>
        {message && <p className="success-banner">{message}</p>}
        {error && <p className="error-banner">{error}</p>}
        {loading && <p>Loading...</p>}
        {!loading && events.length === 0 && <p>No events available yet.</p>}
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
              {events.map((event) => {
                const isFull = event.status !== 'OPEN'
                return (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.maxCapacity}</td>
                    <td>
                      <span className={`badge ${event.status === 'OPEN' ? 'open' : 'closed'}`}>{event.status}</span>
                    </td>
                    <td>
                      {event.registeredByCurrentUser ? (
                        <span className="badge checked-in">Registered</span>
                      ) : (
                        <button
                          onClick={() => handleRegister(event.id)}
                          disabled={isFull || registeringId === event.id}
                        >
                          {registeringId === event.id ? 'Registering...' : 'Register'}
                        </button>
                      )}
                      {' '}
                      <Link to={`/events/${event.id}/summary`}>Summary</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
