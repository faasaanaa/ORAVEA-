import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, limit, where } from 'firebase/firestore'
import { db } from '../services/firebase'
import QuantityPicker from '../components/QuantityPicker'
import { useCartDispatch } from '../context/CartContext'
import { formatCurrency } from '../utils'
import { motion, AnimatePresence } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [index, setIndex] = useState(0) // 👈 move up
  const timerRef = useRef(null) // 👈 move up
  const dispatch = useCartDispatch()
  const nav = useNavigate()

  useEffect(() => {
    async function load() {
      const d = await getDoc(doc(db, 'products', id))
      if (d.exists()) setProduct({ id: d.id, ...d.data() })
    }
    load()
  }, [id])

  const images = product?.images && product.images.length ? product.images : ['https://picsum.photos/seed/default/800/600']

  useEffect(() => {
    if (images.length <= 1) return
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [images.length])

  const goTo = (i) => {
    setIndex(i)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = setInterval(
        () => setIndex((p) => (p + 1) % images.length),
        5000
      )
    }
  }

  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    async function loadRelated() {
      try {
        const q = query(collection(db, 'products'), limit(6))
        const snap = await getDocs(q)
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== id)
        setRelated(items)
      } catch (e) {
        console.error('Related load failed', e)
      }
    }
    loadRelated()
  }, [id])

  useEffect(() => {
    async function loadReviews() {
      try {
        const q = query(collection(db, 'reviews'), where('productId', '==', id))
        const snap = await getDocs(q)
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setReviews(items)
      } catch (e) {
        console.error('Failed to load reviews', e)
      }
    }
    loadReviews()
  }, [id])

  if (!product) return <div className="p-6">Loading...</div>

  const addToCart = () => {
    if (product.stock === 0) return
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        qty,
      },
    })
    nav('/cart')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Images on top */}
      <div className="relative h-80 md:h-[40rem] overflow-hidden rounded-md bg-black/20">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`${product?.name} - ${index + 1}`}
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                className={`w-3 h-3 rounded-full ${i === index ? 'bg-brand-gold' : 'bg-white/30'}`}
              ></button>
            ))}
          </div>
        )}
      </div>

      {/* Basic info */}
      <div className="mt-6">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <div className="text-brand-gold mt-2 text-2xl">{formatCurrency(product.price, product.currency)}</div>
        <p className="mt-3 text-gray-300 max-w-3xl">{product.shortDescription || product.longDescription?.slice(0, 200)}</p>
      </div>

      {/* Order controls */}
      <div className="mt-6 flex items-center gap-4">
        <QuantityPicker value={qty} onChange={setQty} min={1} max={product.stock || 999} />
        <button onClick={addToCart} className="bg-brand-gold text-black px-4 py-2 rounded" disabled={product.stock === 0}>Add to Cart</button>
        <div className="ml-4 text-sm text-gray-400">{product.stock === 0 ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}</div>
      </div>

      {/* Detailed specs */}
      <div className="mt-8">
        <h3 className="font-semibold">Detailed Specifications</h3>
        <div className="mt-2 text-sm text-gray-300">
          {product.specs && Object.entries(product.specs).map(([k, v]) => (
            <motion.div key={k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="py-2 border-b border-black/10">
              <div className="font-medium">{k}</div>
              <div className="text-gray-400 text-sm">{v}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail chart */}
      {product.detailChart && (
        <div className="mt-6">
          <h4 className="font-semibold">Detail Chart</h4>
          <img src={product.detailChart} alt="detail chart" className="w-full max-h-52 object-contain mt-2 rounded bg-black/10 p-2" />
        </div>
      )}

      {/* Frequently searched / related */}
      {related.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Frequently searched</h3>
          <ProductGrid products={related} />
        </div>
      )}

      {/* Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {reviews.length === 0 ? (
          <div className="text-sm text-gray-400">No comments or reviews</div>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="p-3 bg-black/10 rounded">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.customerName || r.customerEmail || r.productName}</div>
                  <div className="text-sm text-gray-300">{r.rating} ★</div>
                </div>
                {r.comment && <div className="mt-2 text-sm text-gray-400">{r.comment}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
