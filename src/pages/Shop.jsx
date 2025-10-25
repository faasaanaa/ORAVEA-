import React, { useEffect, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import SkeletonCard from '../components/SkeletonCard'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../services/firebase'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'products'))
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-black/20 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-brand-gold" />
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  )
}
