import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartState } from '../context/CartContext'
import { useAuth } from '../services/useAuth'
import { useEffect } from 'react'

export default function Header() {
  const { items } = useCartState()
  const { user, loginWithGoogle, signOut, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  console.log("User:", user?.email, "isAdmin:", isAdmin)

useEffect(() => {
  if (user && isAdmin) {
    console.log("Redirecting admin to /admin ...")
    nav('/admin')
  }
}, [user, isAdmin])

const handleLogin = async () => {
  try {
    const result = await loginWithGoogle()
    if (result.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
      nav('/admin')   // 🔥 Redirect admin
    }
  } catch (e) {
    console.error(e)
  }
}


  return (
    <header className="fixed w-full top-0 left-0 z-40 bg-gradient-to-b from-brand-black-2/80 to-transparent backdrop-blur-md border-b border-black/20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2" aria-label="Organic home">
            <motion.span initial={{ scale: 0.98 }} whileHover={{ scale: 1.03 }} className="text-2xl font-bold text-white">Oravéa</motion.span>
            <span className="text-brand-gold text-2xl">.</span>
          </Link>
          <nav className="hidden md:flex gap-4 items-center text-sm" aria-label="Primary">
            <Link to="/shop" className="opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-gold">Shop</Link>
            <Link to="/track" className="opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-gold">Track Order</Link>
              <Link to="/feedback" className="opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-gold">Feedback</Link>
            <Link to="/contact" className="opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-gold">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Link to="/cart" aria-label="Cart" className="focus:outline-none focus:ring-2 focus:ring-brand-gold rounded-full p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4"></path></svg>
            </Link>
            {items.length > 0 && <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs px-2 rounded-full" aria-live="polite">{items.length}</span>}
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full"/>
              <button onClick={() => signOut()} className="text-sm opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-gold">Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="bg-brand-gold text-black px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold">Login</button>
          )}

          {/* feedback CTA removed to simplify header (kept nav link) */}

          <div className="hidden md:block">
            <label htmlFor="header-search" className="sr-only">Search products</label>
            <input id="header-search" placeholder="Search products" className="bg-black/20 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-brand-gold" />
          </div>

          <button className="md:hidden" onClick={() => setOpen(v => !v)} aria-label="Menu" aria-expanded={open}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-brand-black p-4 border-t border-black/20">
          <div className="flex flex-col gap-3">
            <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link to="/track" onClick={() => setOpen(false)}>Track Order</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
          </div>
        </motion.div>
      )}
    </header>
  )
}
