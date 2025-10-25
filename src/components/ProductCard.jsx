
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatCurrency } from '../utils'

export default function ProductCard({ product }) {
  const stock = product.stock ?? 0
  const img = product.images?.[0] || 'https://picsum.photos/seed/default/600/400'
  const [avg, setAvg] = useState(4.9)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const q = query(collection(db, 'reviews'), where('productId', '==', product.id))
        const snap = await getDocs(q)
        if (!mounted) return
        if (!snap.empty) {
          const vals = snap.docs.map(d => d.data().rating || 0)
          const avgv = vals.reduce((s,v)=>s+v,0)/vals.length
          setAvg(Number((avgv).toFixed(1)))
        }
      } catch (e) {
        // ignore and keep default
      }
    }
    load()
    return () => { mounted = false }
  }, [product.id])
  return (
    <motion.article whileHover={{ y: -8 }} className="bg-gradient-to-br from-black/30 to-black/20 border border-black/20 p-4 rounded-lg shadow-lg hover:shadow-gold-glow transition-shadow" role="group" aria-label={`Product ${product.name}`}>
      <Link to={`/product/${product.id}`} className="no-underline" aria-label={`View ${product.name}`}>
        <div className="relative h-48 overflow-hidden rounded-md">
          <motion.img src={img} alt={product.name} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" initial={{ scale: 1.02, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} />
          <div className="absolute top-3 left-3 bg-black/60 text-xs px-2 py-1 rounded">Premium</div>
          <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-black/60">
            {stock === 0 ? <span className="text-red-400 font-bold">Sold Out</span>
            : stock <=5 ? <span className="text-yellow-300">Only {stock} left</span>
            : <span className="text-green-300">In stock</span>}
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
        <div className="text-brand-gold mt-1 text-lg">{formatCurrency(product.price, product.currency)}</div>
        <p className="text-xs text-gray-300 mt-2 line-clamp-3">{product.shortDescription}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2" aria-hidden>
            <div className="text-sm text-gray-400">★★★★★</div>
            <div className="text-xs text-gray-500">({avg})</div>
          </div>
          <div>
            <button className="btn-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold text-sm">View</button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

ProductCard.propTypes = { product: PropTypes.object.isRequired }
