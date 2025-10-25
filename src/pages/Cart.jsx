import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartState, useCartDispatch } from '../context/CartContext'
import { formatCurrency } from '../utils'

export default function CartPage() {
  const { items } = useCartState()
  const dispatch = useCartDispatch()
  const nav = useNavigate()

  const subtotal = items.reduce((s,i) => s + i.price * i.qty, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-6">Your cart is empty. <Link to="/shop" className="text-brand-gold">Shop now</Link></div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-black/20 p-3 rounded">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-300">Qty: {item.qty}</div>
              </div>
              <div className="text-right">
                <div>{formatCurrency(item.price)}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })} className="text-xs px-2 py-1 bg-red-600 rounded">Remove</button>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })} className="text-xs px-2 py-1 bg-black/30 rounded">+</button>
                </div>
              </div>
            </div>
          ))}

          <div className="text-right">
            <div className="text-gray-300">Subtotal: <span className="font-semibold">{formatCurrency(subtotal)}</span></div>
            <button onClick={() => nav('/checkout')} className="mt-4 bg-brand-gold text-black px-4 py-2 rounded">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}
