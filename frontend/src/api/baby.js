import { get, put } from './client'

export function fetchBaby() {
  return get('/baby')
}

export function updateBaby(data) {
  return put('/baby', data)
}
