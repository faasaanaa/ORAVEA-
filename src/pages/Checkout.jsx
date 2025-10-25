import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartState, useCartDispatch } from '../context/CartContext'
import { db, runTransaction, doc, collection, addDoc, serverTimestamp } from '../services/firebase'
import { generateOrderId, formatCurrency } from '../utils'
import generateOrderPdf from '../utils/pdfSlip'

export default function Checkout() {
  const { items } = useCartState()
  const dispatch = useCartDispatch()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', shipping: { line1:'', city:'', state:'', postal:'', country:'' }, billingSame: true, billing: { line1:'', city:'', state:'', postal:'', country:'' }, notes: '' })

  const total = items.reduce((s,i) => s + i.price * i.qty, 0)

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!form.name || !form.email || !form.whatsapp || items.length === 0) {
    alert('Please fill required fields and have items in cart')
    return
  }

  setLoading(true)
  try {
    const orderId = generateOrderId()
    const orderRef = doc(collection(db, 'orders'))

    await runTransaction(db, async (t) => {
  // 1️⃣ Collect all product data (READS)
  const productSnaps = []
  for (const it of items) {
    const pRef = doc(db, 'products', it.id)
    const snap = await t.get(pRef)
    if (!snap.exists()) throw new Error(`Product ${it.name} not found`)
    const stock = snap.data().stock || 0
    if (stock < it.qty) throw new Error(`Not enough stock for ${it.name}`)
    productSnaps.push({ ref: pRef, stock, qty: it.qty })
  }

  // 2️⃣ Perform all writes (UPDATE STOCK)
  for (const p of productSnaps) {
    t.update(p.ref, { stock: p.stock - p.qty })
  }

  // 3️⃣ NOW safely create the orderRef *inside* the transaction
  const orderRef = doc(collection(db, 'orders'))

  const orderData = {
    orderId,
    items: items.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
      subtotal: i.price * i.qty
    })),
    totalAmount: total,
    currency: items[0]?.currency || 'Rs',
    customer: {
      name: form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      shipping: form.shipping,
      billing: form.billingSame ? form.shipping : form.billing
    },
    notes: form.notes,
    payment: { method: 'mock', status: 'unpaid' },
    status: 'unconfirmed',
    createdAt: serverTimestamp()
  }

  // 4️⃣ Set order after all reads are done
  t.set(orderRef, orderData)
})


    // generate PDF slip outside transaction
    generateOrderPdf({
      orderId,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        subtotal: i.price * i.qty
      })),
      totalAmount: total,
      customer: {
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        shipping: form.shipping,
        billing: form.billingSame ? form.shipping : form.billing
      },
      notes: form.notes,
      status: 'unconfirmed',
      createdAt: new Date(),
      shipmentCost: 0
    }, { forCustomer: true, confirmed: false })

    dispatch({ type: 'CLEAR' })
    nav(`/order/${orderId}`)
  } catch (err) {
    console.error(err)
    alert(err.message || 'Checkout failed')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm">Full name *</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" required />
        </div>
        <div>
          <label className="block text-sm">Email (Gmail) *</label>
          <input type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" required />
        </div>
        <div>
          <label className="block text-sm">WhatsApp number *</label>
          <input value={form.whatsapp} onChange={(e)=>setForm({...form, whatsapp: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" required />
        </div>

        <div>
          <h4 className="font-semibold">Shipping address</h4>
          <input placeholder="Line 1" value={form.shipping.line1} onChange={(e)=>setForm({...form, shipping: {...form.shipping, line1: e.target.value}})} className="w-full px-3 py-2 bg-black/20 rounded mt-2" required />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input placeholder="City" value={form.shipping.city} onChange={(e)=>setForm({...form, shipping: {...form.shipping, city: e.target.value}})} className="px-3 py-2 bg-black/20 rounded" required />
            <input placeholder="State" value={form.shipping.state} onChange={(e)=>setForm({...form, shipping: {...form.shipping, state: e.target.value}})} className="px-3 py-2 bg-black/20 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input placeholder="Postal" value={form.shipping.postal} onChange={(e)=>setForm({...form, shipping: {...form.shipping, postal: e.target.value}})} className="px-3 py-2 bg-black/20 rounded" required />
            <input placeholder="Country" value={form.shipping.country} onChange={(e)=>setForm({...form, shipping: {...form.shipping, country: e.target.value}})} className="px-3 py-2 bg-black/20 rounded" required />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.billingSame} onChange={(e)=>setForm({...form, billingSame: e.target.checked})} /> Billing same as shipping</label>
          {!form.billingSame && (
            <div className="mt-2">
              <input placeholder="Billing Line 1" value={form.billing.line1} onChange={(e)=>setForm({...form, billing: {...form.billing, line1: e.target.value}})} className="w-full px-3 py-2 bg-black/20 rounded mt-2" />
            </div>
          )}
        </div>

        <div>
          <label>Order notes (optional)</label>
          <textarea value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" />
        </div>

        <div className="text-right">
          <div className="mb-2">Total: <span className="font-semibold">{formatCurrency(total)}</span></div>
          <button type="submit" className="bg-brand-gold text-black px-4 py-2 rounded" disabled={loading}>{loading? 'Processing...' : 'Confirm Purchase (Mock)'}</button>
        </div>
      </form>
    </div>
  )
}
