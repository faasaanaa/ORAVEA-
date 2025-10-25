import React, { useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, addDoc, serverTimestamp } from '../services/firebase'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)

  const handle = async () => {
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId))
    const snap = await getDocs(q)
    if (snap.empty) return alert('Order not found')
    const docRef = snap.docs[0]
    const data = docRef.data()
    if (email && data.customer?.email !== email) return alert('Email does not match')
    setOrder(data)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Track Order</h1>
      <div className="mt-4">
        <input placeholder="Order number" value={orderId} onChange={(e)=>setOrderId(e.target.value)} className="px-3 py-2 bg-black/20 rounded w-full" />
        <input placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} className="px-3 py-2 bg-black/20 rounded w-full mt-2" />
        <button onClick={handle} className="mt-3 bg-brand-gold text-black px-4 py-2 rounded">Lookup</button>
      </div>

      {order && (
        <div className="mt-6 bg-black/20 p-4 rounded">
          <div>Order: {order.orderId}</div>
          <div>Status: {order.status}</div>
          <div className="mt-2">Total: {order.totalAmount}</div>
        </div>
      )}

      {/* Reviews are now handled on the dedicated /feedback page */}
    </div>
  )
}

