import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="page">
      <div className="card">
        <h1>Event Pass Management System</h1>
        <p>
          Create and manage college technical events, register students, issue passes, and check
          people in on the day of the event.
        </p>

        {!user && (
          <div className="link-list">
            <Link to="/register">Create an account</Link>
            <Link to="/login">Login</Link>
          </div>
        )}

        {user?.role === 'ORGANIZER' && (
          <div className="link-list">
            <Link to="/organizer">Go to Organizer Dashboard</Link>
          </div>
        )}

        {user?.role === 'PARTICIPANT' && (
          <div className="link-list">
            <Link to="/events">Browse Events</Link>
            <Link to="/my-registrations">My Registrations</Link>
          </div>
        )}
      </div>
    </div>
  )
}
