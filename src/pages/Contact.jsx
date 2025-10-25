import React, { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const validate = () => {
    if (!form.name || !form.message) {
      alert('Please enter your name and message')
      return false
    }
    return true
  }

  const sendWhatsApp = () => {
    if (!validate()) return
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || ''
    const txtParts = [
      `name: ${form.name}`,
      form.email ? `email: ${form.email}` : null,
      `message: ${form.message}`,
    ].filter(Boolean).join('\n')
    const encoded = encodeURIComponent(txtParts)
    // use wa.me for web/mobile compatibility
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`
    window.open(url, '_blank')
  }

  const sendGmail = () => {
    if (!validate()) return
    const to = import.meta.env.VITE_CONTACT_EMAIL || ''
    const subject = encodeURIComponent(`Contact from ${form.name}`)
    const body = encodeURIComponent(`name: ${form.name}\n${form.email ? `email: ${form.email}\n` : ''}message: ${form.message}`)
    const mailto = to ? `mailto:${to}?subject=${subject}&body=${body}` : `mailto:?subject=${subject}&body=${body}`
    // Use location.href so mobile mail apps open
    window.location.href = mailto
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <div className="mt-4 space-y-3">
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" />
        <input placeholder="Email (optional)" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" />
        <textarea placeholder="Message" value={form.message} onChange={(e)=>setForm({...form, message: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" />

        <div className="flex gap-3">
          <button onClick={sendWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded">Send via WhatsApp</button>
          <button onClick={sendGmail} className="bg-brand-gold text-black px-4 py-2 rounded">Send via Gmail</button>
        </div>

        <div className="text-xs text-gray-400 mt-2">Tip: your message will be opened in the selected service with your name and message tagged as requested.</div>
      </div>
    </div>
  )
}
