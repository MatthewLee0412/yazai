import { get, post, put, del } from './client'

export function fetchInsurancePolicies() {
  return get('/insurance-policies')
}

export function createInsurancePolicy(data) {
  return post('/insurance-policies', data)
}

export function updateInsurancePolicy(id, data) {
  return put(`/insurance-policies/${id}`, data)
}

export function deleteInsurancePolicy(id) {
  return del(`/insurance-policies/${id}`)
}
