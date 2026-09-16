import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { checkInToEvent } from '../../api/registrations'
import { getErrorMessage } from '../../api/client'
import { Registration } from '../../types'

export default function CheckInPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<Registration | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCheckIn() {
    if (!eventId) return
    setLoading(true)
    setError(null)
    try {
      const registration = await checkInToEvent(Number(eventId))
      setResult(registration)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <p>
        <Link to="/my-registrations">&larr; Back to my registrations</Link>
      </p>
      <div className="card">
        <h1>Event Check-In</h1>
        {error && <p className="error-banner">{error}</p>}
        {result ? (
          <>
            <p className="success-banner">
              Checked in to <strong>{result.eventName}</strong> successfully!
            </p>
            <button onClick={() => navigate('/my-registrations')}>Back to my registrations</button>
          </>
        ) : (
          <>
            <p>Tap the button below to check in to this event.</p>
            <button onClick={handleCheckIn} disabled={loading}>
              {loading ? 'Checking in...' : 'Check In'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
