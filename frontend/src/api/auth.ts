import client from './client'
import { AuthResponse, Role } from '../types'

export interface RegisterPayload {
  name: string
  email: string
  dob: string
  password: string
  role: Role
}

export interface LoginPayload {
  email: string
  password: string
}

export function registerStudent(payload: RegisterPayload) {
  return client.post<AuthResponse>('/auth/register', payload).then((res) => res.data)
}

export function loginStudent(payload: LoginPayload) {
  return client.post<AuthResponse>('/auth/login', payload).then((res) => res.data)
}
