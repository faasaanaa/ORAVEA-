import React, { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import generateOrderPdf from '../../utils/pdfSlip'
import { formatCurrency } from '../../utils'

const statuses = ['unconfirmed','confirmed','processing','dispatched','delivered','cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'orders'))
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  const changeStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status })
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))
  }

  const confirmOrder = async (id) => {
    // mark as confirmed
    const ord = orders.find(x => x.id === id)
    // ensure shipmentCost is present on the order object
    await changeStatus(id, 'confirmed')
    // refresh local order to reflect confirmed status
    setOrders(o => o.map(x => x.id === id ? { ...x, status: 'confirmed' } : x))
    // generate admin slip (confirmed)
    if (ord) {
      const withShipment = { ...ord, shipmentCost: ord.shipmentCost || 0 }
      generateOrderPdf(withShipment, { forCustomer: false, confirmed: true })
      // generate confirmed customer slip
      generateOrderPdf(withShipment, { forCustomer: true, confirmed: true })
    }
  }

  const downloadSlip = (order) => {
    const withShipment = { ...order, shipmentCost: order.shipmentCost || 0 }
    // default to admin slip for download
    generateOrderPdf(withShipment, { forCustomer: false, confirmed: order.status === 'confirmed' })
  }

  const updateShipment = async (id, value) => {
    const num = Number(value || 0)
    await updateDoc(doc(db, 'orders', id), { shipmentCost: num })
    setOrders(o => o.map(x => x.id === id ? { ...x, shipmentCost: num } : x))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Orders</h2>
      <div className="mt-4 space-y-3">
        {orders.map(o => (
          <div key={o.id} className="admin-item">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono">{o.orderId}</div>
                    <div className="text-sm">{o.customer?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Total</div>
                      <div className="font-semibold">{formatCurrency(o.totalAmount)}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {o.items?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-black/10 py-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{it.name}</div>
                        <div className="text-xs text-gray-300">Qty: {it.qty}</div>
                      </div>
                      <div className="text-sm">{it.currency ? `${it.currency} ${it.subtotal}` : formatCurrency(it.subtotal)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-sm">
                  <div className="font-semibold">Shipping</div>
                  <div>{o.customer?.shipping?.line1}</div>
                  <div>{[o.customer?.shipping?.city, o.customer?.shipping?.state, o.customer?.shipping?.postal].filter(Boolean).join(', ')}</div>
                  <div>{o.customer?.shipping?.country}</div>
                  <div className="mt-2">
                    <label className="text-xs">Shipment cost</label>
                    <input type="number" defaultValue={o.shipmentCost || 0} onBlur={(e)=>updateShipment(o.id, e.target.value)} className="w-32 px-2 py-1 bg-black/20 rounded ml-2 text-sm" />
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <div className={`px-3 py-1 rounded text-sm ${o.status==='delivered'? 'bg-green-600 text-black' : o.status==='processing'? 'bg-yellow-400 text-black' : o.status==='cancelled'? 'bg-red-600 text-black' : 'bg-white/10 text-white'}`}>
                  {o.status}
                </div>

                <select value={o.status} onChange={(e)=>changeStatus(o.id, e.target.value)} className="bg-black/30 px-2 py-1 rounded">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="flex gap-2">
                  <button onClick={()=>confirmOrder(o.id)} className="bg-brand-gold text-black px-3 py-1 rounded text-sm">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
