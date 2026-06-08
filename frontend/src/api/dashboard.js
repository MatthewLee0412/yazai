import { get } from './client'

export function fetchDashboard() {
  return get('/dashboard')
}
