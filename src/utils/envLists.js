export function listFromEnv(varName) {
  try {
    const raw = import.meta.env[varName] || ''
    return raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  } catch (e) {
    // fallback for non-Vite environments
    if (typeof process !== 'undefined' && process.env) {
      const raw = process.env[varName] || ''
      return raw.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }
}

export function firstOrFallback(listVar, singleVar) {
  const list = listFromEnv(listVar)
  if (list.length) return list
  const single = import.meta.env[singleVar] || (typeof process !== 'undefined' && process.env ? process.env[singleVar] : '')
  return single ? [single.trim()] : []
}
