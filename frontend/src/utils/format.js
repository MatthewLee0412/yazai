export function formatDate(value) {
  return value || '-'
}

export function formatAge(birthDate) {
  if (!birthDate) return '待填写'
  const start = new Date(birthDate)
  const now = new Date()
  let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth()
  if (now.getDate() < start.getDate()) months -= 1
  if (months < 12) return `${Math.max(months, 0)}月龄`
  const years = Math.floor(months / 12)
  const leftMonths = months % 12
  return leftMonths ? `${years}岁${leftMonths}月` : `${years}岁`
}

export function empty(value) {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}
