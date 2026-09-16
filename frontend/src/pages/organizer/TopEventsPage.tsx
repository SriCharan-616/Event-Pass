import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopEvents } from '../../api/events'
import { getErrorMessage } from '../../api/client'
import { TopEvent } from '../../types'

export default function TopEventsPage() {
  const [topEvents, setTopEvents] = useState<TopEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopEvents()
      .then(setTopEvents)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <p>
        <Link to="/organizer">&larr; Back to dashboard</Link>
      </p>
      <div className="card">
        <h1>Top Events by Registration</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error-banner">{error}</p>}
        {!loading && topEvents.length === 0 && <p>No registrations yet.</p>}
        {!loading && topEvents.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Total Registrations</th>
              </tr>
            </thead>
            <tbody>
              {topEvents.map((event, index) => (
                <tr key={event.eventId}>
                  <td>{index + 1}</td>
                  <td>{event.eventName}</td>
                  <td>{event.totalRegistrations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
