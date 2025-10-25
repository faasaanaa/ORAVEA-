import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 bg-brand-black-2 text-sm text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Oravéa</h3>
          <p className="mt-2 text-xs">Premium organic products curated for wellness. Sustainable, ethical and beautiful.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-1">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/track">Track Order</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-2 space-y-1">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/20 py-4 text-center text-xs">
        <div>© {new Date().getFullYear()} Oravéa All rights reserved.</div>
  <div className="mt-1 text-gray-400">Designed and deployed by <span className="text-brand-gold font-semibold uppercase">Saaforge</span>.</div>
      </div>
    </footer>
  )
}
