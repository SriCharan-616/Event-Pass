import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerStudent } from '../api/auth'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('PARTICIPANT')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const auth = await registerStudent({ name, email, dob, password, role })
      login(auth)
      navigate(auth.role === 'ORGANIZER' ? '/organizer' : '/events')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Create an account</h1>
        {error && <p className="error-banner">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Date of birth
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            I am a...
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="PARTICIPANT">Student / Participant</option>
              <option value="ORGANIZER">Event Organizer</option>
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}
