const BASE_URL = '/api'

async function request(path, options = {}) {
  const init = { method: options.method || 'GET', headers: {} }
  if (options.body !== undefined) {
    init.headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(options.body)
  }
  const response = await fetch(`${BASE_URL}${path}`, init)
  if (!response.ok) {
    let message = '请求失败'
    try {
      const error = await response.json()
      message = error.message || message
    } catch {
      message = `${message}: ${response.status}`
    }
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export function get(path) { return request(path) }
export function post(path, body) { return request(path, { method: 'POST', body }) }
export function put(path, body) { return request(path, { method: 'PUT', body }) }
export function del(path) { return request(path, { method: 'DELETE' }) }
