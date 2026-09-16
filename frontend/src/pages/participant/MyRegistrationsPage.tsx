import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelRegistration, listMyRegistrations } from '../../api/registrations'
import { getErrorMessage } from '../../api/client'
import { Registration } from '../../types'

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await listMyRegistrations()
      setRegistrations(data)
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCancel(eventId: number) {
    setCancelingId(eventId)
    setError(null)
    try {
      await cancelRegistration(eventId)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>My Registrations</h1>
        {error && <p className="error-banner">{error}</p>}
        {loading && <p>Loading...</p>}
        {!loading && registrations.length === 0 && (
          <p>
            You haven't registered for any events yet. <Link to="/events">Browse events</Link>
          </p>
        )}
        {!loading && registrations.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.registrationId}>
                  <td>{reg.eventName}</td>
                  <td>{reg.eventDate}</td>
                  <td>
                    <span className={`badge ${reg.checkedIn ? 'checked-in' : 'pending'}`}>
                      {reg.checkedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </td>
                  <td>
                    {!reg.checkedIn && (
                      <>
                        <Link to={`/my-registrations/${reg.eventId}/checkin`}>Check In</Link>{' '}
                        <button
                          className="danger"
                          onClick={() => handleCancel(reg.eventId)}
                          disabled={cancelingId === reg.eventId}
                        >
                          {cancelingId === reg.eventId ? 'Canceling...' : 'Cancel'}
                        </button>
                      </>
                    )}
                    {' '}
                    <Link to={`/events/${reg.eventId}/summary`}>Summary</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
