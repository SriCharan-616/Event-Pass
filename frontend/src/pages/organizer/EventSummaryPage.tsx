import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEventSummary } from '../../api/events'
import { getErrorMessage } from '../../api/client'
import { EventSummary } from '../../types'
import EventSummaryCard from '../../components/EventSummaryCard'

export default function EventSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const [summary, setSummary] = useState<EventSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getEventSummary(Number(id))
      .then(setSummary)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="page">
      <p>
        <Link to="/organizer">&larr; Back to dashboard</Link>
      </p>
      {loading && <p>Loading...</p>}
      {error && <p className="error-banner">{error}</p>}
      {summary && <EventSummaryCard summary={summary} />}
    </div>
  )
}
