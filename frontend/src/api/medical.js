import { get, post, put, del } from './client'

export function fetchMedicalVisits() {
  return get('/medical-visits')
}

export function createMedicalVisit(data) {
  return post('/medical-visits', data)
}

export function updateMedicalVisit(id, data) {
  return put(`/medical-visits/${id}`, data)
}

export function deleteMedicalVisit(id) {
  return del(`/medical-visits/${id}`)
}
