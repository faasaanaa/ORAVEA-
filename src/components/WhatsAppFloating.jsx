import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppFloating() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || ''

  const send = () => {
    if (!number) return alert('WhatsApp number not configured')
    if (!message.trim()) return alert('Please type a message')
    const encoded = encodeURIComponent(message.trim())
    const url = `https://wa.me/${number}?text=${encoded}`
    window.open(url, '_blank')
    setMessage('')
    setOpen(false)
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mb-3 w-80 bg-brand-black-2 p-3 rounded-lg shadow-lg border border-black/30">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Chat on WhatsApp</div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-300">✕</button>
            </div>
            <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={4} className="w-full mt-2 bg-black/20 rounded p-2 text-sm" placeholder="Type your message..." />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-400">Will open WhatsApp</div>
              <button onClick={send} className="bg-brand-gold text-black px-3 py-1 rounded">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen(v=>!v)} aria-label="Open WhatsApp chat" className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M21.7 20.3c-.4 1.3-1.3 2.4-2.6 2.9-2.3.9-4.7 1.3-7.1 1.3-6.6 0-12-4.9-12-10.9C0 6.9 5.4 2 12 2s12 4.9 12 10.9c0 1.9-.5 3.7-1.3 5.3z" fill="#fff" opacity="0.06" />
          <path d="M20.5 14.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.8.2-.2.3-.8 1-.9 1.2-.2.3-.4.4-.8.2-3.4-1.7-5.5-3-7.7-5.6-.3-.3 0-.5.2-.7.2-.2.4-.5.6-.7.2-.2.2-.4.3-.6.1-.2 0-.5 0-.8 0-.3-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6-.2 0-.5 0-.8 0-.3 0-.8.1-1.2.5-.4.4-1.5 1.5-1.5 3.6 0 2.1 1.6 4.2 3.6 5.4 2.2 1.4 3.7 1.9 5.6 2.9 1.8 1 2.9 1.1 4 .9 0 0 .1-.2.3-.5.2-.3.6-.8.7-1 .2-.3.1-.5-.2-.7z" fill="#fff" />
        </svg>
      </button>
    </div>
  )
}
