import React, { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { formatCurrency } from '../../utils'

export default function Feedbacks() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'reviews'))
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  const remove = async (id) => {
    if (!confirm('Delete this review?')) return
    await deleteDoc(doc(db, 'reviews', id))
    setReviews(r => r.filter(x => x.id !== id))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Feedbacks</h2>
      <div className="mt-4 space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="admin-item">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium">{r.productName || '—'}</div>
                <div className="text-xs text-gray-300">Order: {r.orderId || '—'}</div>
                <div className="text-sm mt-1">By: {r.customerName || r.customerEmail || 'Anonymous'}</div>
                <div className="text-sm mt-2">Rating: <span className="font-semibold">{r.rating} ★</span></div>
                {r.comment && <div className="mt-2 text-sm text-gray-300">{r.comment}</div>}
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <div className="text-xs text-gray-400">{r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toLocaleString() : ''}</div>
                <button onClick={()=>remove(r.id)} className="bg-red-600 px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
