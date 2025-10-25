import React from 'react'
import PropTypes from 'prop-types'

export default function QuantityPicker({ value, onChange, min = 1, max = 999 }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - 1))} className="px-3 py-1 bg-black/30 rounded">-</button>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-16 text-center bg-black/20 rounded px-2" min={min} max={max} />
      <button onClick={() => onChange(Math.min(max, value + 1))} className="px-3 py-1 bg-black/30 rounded">+</button>
    </div>
  )
}

QuantityPicker.propTypes = { value: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired }
