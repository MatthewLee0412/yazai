import { get, post, put, del } from './client'

export function fetchVaccineTemplates() {
  return get('/vaccine-templates')
}

export function fetchVaccineRecords() {
  return get('/vaccine-records')
}

export function createVaccineRecord(data) {
  return post('/vaccine-records', data)
}

export function updateVaccineRecord(id, data) {
  return put(`/vaccine-records/${id}`, data)
}

export function deleteVaccineRecord(id) {
  return del(`/vaccine-records/${id}`)
}
