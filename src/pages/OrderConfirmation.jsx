import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'orders'), where('orderId', '==', orderId))
      const snap = await getDocs(q)
      if (!snap.empty) setOrder(snap.docs[0].data())
    }
    load()
  }, [orderId])

  if (!order) return <div className="p-6">Order not found or loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Order Details</h1>
      <div className="mt-4 bg-black/20 p-6 rounded space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono">Order ID</div>
            <div className="font-semibold">{order.orderId}</div>
          </div>
          <div className="text-right">
            <div className="text-sm">Status</div>
            <div className="font-semibold">{order.status || 'unconfirmed'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Items</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between border-b border-black/10 py-2">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-300">Quantity</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">x {it.qty}</div>
                    <div className="text-sm">{it.subtotal}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <div className="text-sm">Total</div>
              <div className="font-semibold">{order.totalAmount}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Shipping Address</h3>
            <div className="mt-2">
              <div className="font-medium">{order.customer?.name}</div>
              <div>{order.customer?.shipping?.line1}</div>
              <div>{[order.customer?.shipping?.city, order.customer?.shipping?.state, order.customer?.shipping?.postal].filter(Boolean).join(', ')}</div>
              <div>{order.customer?.shipping?.country}</div>
              <div className="mt-2 text-sm">WhatsApp: {order.customer?.whatsapp}</div>
              <div className="mt-2 text-sm">Email: {order.customer?.email}</div>
            </div>
          </div>
        </div>

        <div>
          <Link to="/track" className="text-brand-gold">
            Track your order
          </Link>
        </div>
      </div>
    </div>
  )
}
