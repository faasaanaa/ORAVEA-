import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Orders from './Orders'
import Products from './Products'
import Feedbacks from './Feedbacks'

export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <nav className="space-x-3">
          <Link to="orders" className="text-brand-gold">Orders</Link>
          <Link to="products" className="text-brand-gold">Products</Link>
          <Link to="feedbacks" className="text-brand-gold">Feedbacks</Link>
        </nav>
      </div>

      <div className="mt-6">
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="feedbacks" element={<Feedbacks />} />
        </Routes>
      </div>
    </div>
  )
}
