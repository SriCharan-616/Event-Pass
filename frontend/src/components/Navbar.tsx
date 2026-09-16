import { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        Event Pass
      </Link>
      <div style={styles.links}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
        {user?.role === 'ORGANIZER' && (
          <Link to="/organizer" style={styles.link}>Organizer Dashboard</Link>
        )}
        {user?.role === 'PARTICIPANT' && (
          <>
            <Link to="/events" style={styles.link}>Browse Events</Link>
            <Link to="/my-registrations" style={styles.link}>My Registrations</Link>
          </>
        )}
        {user && (
          <>
            <span style={styles.userInfo}>{user.name} ({user.role})</span>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

const styles: Record<string, CSSProperties> = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#1e293b',
    color: '#fff',
    flexWrap: 'wrap',
    gap: 12,
  },
  brand: { color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  link: { color: '#cbd5e1', textDecoration: 'none' },
  userInfo: { color: '#94a3b8', fontSize: 14 },
  logoutButton: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
  },
}
