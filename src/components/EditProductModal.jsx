import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import { uploadToCloudinary } from '../utils/cloudinary'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase'

export default function EditProductModal({ open, onClose, product, onUpdated }) {
  const [form, setForm] = useState(product || {})
  const [newFiles, setNewFiles] = useState([])
  const [removals, setRemovals] = useState([])
  const [loading, setLoading] = useState(false)
  const [specsText, setSpecsText] = useState(product && product.specs ? Object.entries(product.specs).map(([k,v])=>`${k}: ${v}`).join('\n') : '')

  function toggleRemoval(url) {
    setRemovals(r => r.includes(url) ? r.filter(x=>x!==url) : [...r, url])
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      let images = form.images ? [...form.images] : []
      // remove marked
      images = images.filter(u => !removals.includes(u))
      // upload new files
      if (newFiles.length) {
        const uploaded = await Promise.all(newFiles.map(f => uploadToCloudinary(f)))
        images = [...images, ...uploaded]
      }
      // parse specsText
      const specs = {}
      specsText.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
        const [k, ...rest] = line.split(':')
        if (!k) return
        specs[k.trim()] = rest.join(':').trim()
      })

      const pRef = doc(db, 'products', product.id)
      // ensure numeric fields are proper numbers and non-negative
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        images,
        specs,
      }
      await updateDoc(pRef, payload)
      onUpdated(payload)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Update failed: ' + (err.message||err))
    } finally { setLoading(false) }
  }

  if (!product) return null

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Edit product</h3>
        <input value={form.name||''} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-black/20 rounded" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="relative flex items-center gap-2">
            <input
              value={form.price ?? 0}
              type="number"
              min={0}
              step="0.01"
              onChange={(e) => {
                const v = parseFloat(e.target.value)
                const nv = Number.isNaN(v) ? 0 : Math.max(0, v)
                setForm({ ...form, price: nv })
              }}
              className="px-3 py-2 bg-black/20 rounded pr-16 w-full"
              placeholder="Price"
              aria-label="Price in RS"
            />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-yellow-300 font-medium pointer-events-none">RS</span>
          </div>
          <div className="relative flex items-center gap-2">
            <input
              value={form.stock ?? 0}
              type="number"
              min={0}
              step="1"
              onChange={(e) => {
                const v = parseInt(e.target.value)
                const nv = Number.isNaN(v) ? 0 : Math.max(0, v)
                setForm({ ...form, stock: nv })
              }}
              className="px-3 py-2 bg-black/20 rounded pr-14 w-full"
              placeholder="Stock"
              aria-label="Stock quantity"
            />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-yellow-300 font-medium pointer-events-none">QNT</span>
          </div>
        </div>
        <textarea value={form.shortDescription||''} onChange={(e)=>setForm({...form, shortDescription: e.target.value})} className="w-full mt-2 px-3 py-2 bg-black/20 rounded" />

        <div className="mt-2">
          <div className="text-sm">Existing images</div>
          <div className="flex gap-2 mt-2">
            {(form.images||[]).map((u,idx) => (
              <div key={idx} className="relative">
                <img src={u} alt={`img-${idx}`} className={`w-20 h-20 object-cover rounded ${removals.includes(u)? 'opacity-40' : ''}`} />
                <button onClick={() => toggleRemoval(u)} className="absolute top-1 right-1 bg-black/50 px-1 rounded text-xs">{removals.includes(u)? 'Undo' : 'Remove'}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <label className="text-sm">Add new images</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>setNewFiles(Array.from(e.target.files))} className="w-full mt-1" />
        </div>

        <div className="mt-2">
          <label className="text-sm">Detailed specifications (Key: Value per line)</label>
          <textarea value={specsText} onChange={(e)=>setSpecsText(e.target.value)} className="w-full h-28 px-3 py-2 bg-black/20 rounded mt-1" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-black/20 rounded">Cancel</button>
          <button onClick={handleSave} className="btn-gold" disabled={loading}>{loading? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  )
}

EditProductModal.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, product: PropTypes.object, onUpdated: PropTypes.func }
