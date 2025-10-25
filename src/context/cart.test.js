import { describe, it, expect } from 'vitest'
import { cartReducer } from './cartTestHelper'

describe('cart reducer', () => {
  it('adds an item and increases qty if same item added', () => {
    const initial = { items: [] }
    const after = cartReducer(initial, { type: 'ADD_ITEM', payload: { id: 'p1', name: 'Test', price: 5, qty: 1 } })
    expect(after.items.length).toBe(1)
    const after2 = cartReducer(after, { type: 'ADD_ITEM', payload: { id: 'p1', name: 'Test', price: 5, qty: 2 } })
    expect(after2.items[0].qty).toBe(3)
  })
})
