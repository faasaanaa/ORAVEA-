import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import WhatsAppFloating from '../components/WhatsAppFloating'
import AnimatedBackground from '../components/AnimatedBackground'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

export default function Home() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'products'))
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }} className="inline-block">
            <span className="hero-badge">Premium • Organic</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight hero-heading">Organic premium products for everyday wellness</motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-gray-300 max-w-lg">Curated, sustainable and luxurious organic goods delivered to your door. Experience premium organic living through ethically-sourced, clinician-vetted items designed to elevate daily rituals.</motion.p>

          <motion.div className="mt-6 flex items-center gap-4" whileHover={{ scale: 1.02 }}>
            <Link to="/shop" className="btn-gold px-6 py-3 shadow-xl">Shop Now</Link>
            <Link to="/contact" className="text-sm text-gray-300 nav-link">Contact Us</Link>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <div className="text-sm text-gray-400">Free shipping over ₹2499</div>
            <div className="h-0.5 w-6 bg-white/8 rounded" />
            <div className="text-sm text-gray-400">Sustainably sourced</div>
            <div className="h-0.5 w-6 bg-white/8 rounded" />
            <div className="text-sm text-gray-400">30-day returns</div>
          </div>
        </div>

        <AnimatedBackground className="h-72 md:h-96">
          <div className="text-center z-10 px-4">
            <div className="text-2xl font-semibold text-white">Featured</div>
            <div className="text-sm text-gray-300 mt-2">Hand-picked organic favorites</div>
          </div>
        </AnimatedBackground>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <ProductGrid products={products.slice(0,8)} />
      </section>
        <WhatsAppFloating />
    </div>
  )
}
