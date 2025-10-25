import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import WhatsAppFloating from '../components/WhatsAppFloating'
import AnimatedBackground from '../components/AnimatedBackground'
import HeroCarousel from '../components/HeroCarousel'
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
      <section className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }} className="inline-block">
          <span className="hero-badge">Premium • Organic</span>
        </motion.div>

        <HeroCarousel className="h-60 sm:h-72 md:h-96">
          <div className="text-center px-3">
            <div className="text-sm uppercase text-yellow-300 font-medium tracking-wider">Organic & Curated</div>
            <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-white">Naturally premium essentials</motion.h2>
            <div className="mt-2 text-sm text-white/85 hidden sm:block">Hand-picked organic favourites for daily wellness</div>
          </div>
        </HeroCarousel>

        <div className="px-2 text-center sm:text-left">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-2 text-gray-300 max-w-xl mx-auto sm:mx-0">Curated organic goods — sustainable, effective, and beautifully packaged. Explore the collection.</motion.p>

          <motion.div className="mt-4 flex justify-center sm:justify-start gap-3" whileHover={{ scale: 1.02 }}>
            <Link to="/shop" className="btn-gold px-5 py-2">Shop Now</Link>
            <Link to="/contact" className="text-sm text-gray-300 nav-link">Contact</Link>
          </motion.div>

        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <ProductGrid products={products.slice(0,8)} />
      </section>
        <WhatsAppFloating />
    </div>
  )
}
