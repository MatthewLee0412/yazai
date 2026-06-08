import { get, post, put, del } from './client'

export function fetchGrowthRecords() {
  return get('/growth-records')
}

export function createGrowthRecord(data) {
  return post('/growth-records', data)
}

export function updateGrowthRecord(id, data) {
  return put(`/growth-records/${id}`, data)
}

export function deleteGrowthRecord(id) {
  return del(`/growth-records/${id}`)
}
