import React, { useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, addDoc, serverTimestamp } from '../services/firebase'

export default function Feedback() {
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
      <h1 className="text-2xl font-semibold">Feedback</h1>
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

      {/* Review submission area: allow user to submit rating + comment per product in the order */}
      {order && (
        <div className="mt-6 bg-black/20 p-4 rounded">
          <h2 className="text-lg font-semibold">Leave a review</h2>
          <p className="text-sm text-gray-400">Enter a rating and optional comment for a product from this order.</p>
          <div className="mt-4 space-y-4">
            {order.items?.map((it) => (
              <ReviewForm key={it.id} item={it} orderId={order.orderId} customer={order.customer} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


function ReviewForm({ item, orderId, customer }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (done) return alert('Review already submitted')
    setLoading(true)
    try {
      // prevent duplicate review by querying existing reviews for this order+product
      const q = query(collection(db, 'reviews'), where('orderId', '==', orderId), where('productId', '==', item.id))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setDone(true)
        alert('You already submitted a review for this product on this order')
        return
      }

      await addDoc(collection(db, 'reviews'), {
        productId: item.id,
        productName: item.name,
        orderId,
        rating: Number(rating),
        comment: comment || '',
        customerName: customer?.name || '',
        customerEmail: customer?.email || '',
        createdAt: serverTimestamp(),
      })
      setDone(true)
      alert('Thanks for your review!')
    } catch (err) {
      console.error('Review submit failed', err)
      alert('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 bg-black/10 rounded">
      <div className="font-medium">{item.name}</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <select value={rating} onChange={(e)=>setRating(e.target.value)} className="px-2 py-1 bg-black/20 rounded">
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
        <input placeholder="Optional comment" value={comment} onChange={(e)=>setComment(e.target.value)} className="col-span-2 px-2 py-1 bg-black/20 rounded" />
      </div>
      <div className="mt-2 text-right">
        {done ? <span className="text-sm text-green-300">Review submitted</span>
        : <button onClick={submit} className="bg-brand-gold text-black px-3 py-1 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit review'}</button>}
      </div>
    </div>
  )
}
