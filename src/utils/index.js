import { v4 as uuidv4 } from 'uuid'

export function generateOrderId() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const date = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `ORG-${date}-${time}-${rand}`
}

export const formatCurrency = (amount, currency = 'Rs') => {
  // Render amounts with 'Rs' prefix for Indian Rupees. We use en-IN locale but
  // force the 'Rs' prefix for consistency with design requirements.
  try {
    if (!amount && amount !== 0) return ''
    // Use Intl for grouping and decimals, then prefix with 'Rs '
    const formatted = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
    return `Rs ${formatted}`
  } catch (err) {
    return `Rs ${amount}`
  }
}
