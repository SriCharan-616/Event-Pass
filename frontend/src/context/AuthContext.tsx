import { createContext, ReactNode, useContext, useState } from 'react'
import { AuthResponse, Role } from '../types'

interface CurrentUser {
  id: number
  name: string
  email: string
  role: Role
}

interface AuthContextValue {
  user: CurrentUser | null
  login: (auth: AuthResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'eventpass_user'

function loadStoredUser(): CurrentUser | null {
  const token = localStorage.getItem('token')
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!token || !stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('token')
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(loadStoredUser)

  function login(auth: AuthResponse) {
    const currentUser: CurrentUser = { id: auth.id, name: auth.name, email: auth.email, role: auth.role }
    localStorage.setItem('token', auth.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser))
    setUser(currentUser)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
