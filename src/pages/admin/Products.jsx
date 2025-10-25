import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import EditProductModal from '../../components/EditProductModal'
import { formatCurrency } from '../../utils'

// Cloudinary helper: expects VITE_CLOUDINARY_UPLOAD_PRESET and VITE_CLOUDINARY_CLOUD_NAME in env
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Cloudinary not configured')
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(url, { method: 'POST', body: fd })
  const text = await res.text()
  let data = null
  try { data = JSON.parse(text) } catch (e) { /* not json */ }
  if (!res.ok) {
    console.error('Cloudinary upload failed', { status: res.status, body: text })
    throw new Error(data?.error?.message || `Cloudinary upload failed (${res.status}) - ${text}`)
  }
  return data?.secure_url || null
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name:'', price:0, currency:'Rs', shortDescription:'', longDescription:'', stock:10, tags: '', category: '', specs: {} })
  const [specsText, setSpecsText] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [detailFile, setDetailFile] = useState(null)
  const [detailPreview, setDetailPreview] = useState(null)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'products'))
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  const [editing, setEditing] = useState(null)

  const openEditor = (p) => setEditing(p)
  const onUpdated = (updated) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p))
  }

  const add = async (e) => {
    e.preventDefault()
    if (imageFiles.length > 5) return alert('Please select up to 5 images')
    try {
      let urls = []
      if (imageFiles.length > 0) {
          // upload all files to Cloudinary
          const uploadPromises = imageFiles.map(async (file) => {
            const url = await uploadToCloudinary(file)
            return url
          })
          urls = await Promise.all(uploadPromises)
        }

        let detailUrl = null
        if (detailFile) {
          detailUrl = await uploadToCloudinary(detailFile)
        }

        // parse specsText into object
        const specs = {}
        specsText.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
          const [k, ...rest] = line.split(':')
          if (!k) return
          specs[k.trim()] = rest.join(':').trim()
        })

        const data = { ...form, specs, tags: form.tags.split(',').map(t=>t.trim()), images: urls, detailChart: detailUrl, createdAt: new Date(), premium: true }
      const docRef = await addDoc(collection(db, 'products'), data)
      setProducts(prev => [{ id: docRef.id, ...data }, ...prev])
  setForm({ name:'', price:0, currency:'Rs', shortDescription:'', longDescription:'', stock:10, tags: '', category: '', specs: {} })
      setImageFiles([])
      setPreviews([])
      alert('Product added')
    } catch (err) {
      console.error('Upload/add failed', err)
      alert('Failed to add product: ' + (err.message||err))
    }
  }

  // legacy helper removed; Cloudinary used instead

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) return alert('Select up to 5 images')
    setImageFiles(files)
    const p = files.map(f => URL.createObjectURL(f))
    setPreviews(p)
  }

  const handleDetailChange = (e) => {
    const f = e.target.files?.[0] || null
    setDetailFile(f)
    setDetailPreview(f ? URL.createObjectURL(f) : null)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="mt-4">
  <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="px-3 py-2 bg-black/20 rounded" />
          <div className="flex items-center gap-2">
            <input placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form, price: Number(e.target.value)})} className="px-3 py-2 bg-black/20 rounded" />
            <span className="text-xs text-gray-400">Price (Rs)</span>
          </div>
          <input placeholder="Short description" value={form.shortDescription} onChange={(e)=>setForm({...form, shortDescription: e.target.value})} className="px-3 py-2 bg-black/20 rounded md:col-span-2" />
          <input placeholder="Tags (comma)" value={form.tags} onChange={(e)=>setForm({...form, tags: e.target.value})} className="px-3 py-2 bg-black/20 rounded" />
          <div className="flex items-center gap-2">
            <input placeholder="Stock" type="number" value={form.stock} onChange={(e)=>setForm({...form, stock: Number(e.target.value)})} className="px-3 py-2 bg-black/20 rounded" />
            <span className="text-xs text-gray-400">Stock (Qnt)</span>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Product images (1-5)</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full text-sm" />
            <div className="mt-2 flex gap-2">
              {previews.map((p, idx) => (
                <img key={idx} src={p} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Optional detail chart image (size/measurement)</label>
            <input type="file" accept="image/*" onChange={handleDetailChange} className="w-full text-sm" />
            {detailPreview && <img src={detailPreview} alt="detail-preview" className="w-32 h-32 object-contain mt-2" />}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Detailed specifications (one per line as Key: Value)</label>
            <textarea value={specsText} onChange={(e)=>setSpecsText(e.target.value)} placeholder="Weight: 500ml\nOrigin: Spain" className="w-full h-28 px-3 py-2 bg-black/20 rounded text-sm" />
          </div>
          <button className="bg-brand-gold text-black px-4 py-2 rounded">Add Product</button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {products.map(p => (
          <div key={p.id} className="admin-item flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              {p.shortDescription && <div className="text-xs text-gray-400 mt-1 line-clamp-2">{p.shortDescription}</div>}
            </div>

            <div className="flex flex-col items-end ml-4">
              <div className="text-brand-gold font-semibold text-right">RS {p.price}</div>
              <div className="text-sm text-gray-300">QNT: {p.stock}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEditor(p)} className="bg-black/30 px-3 py-1 rounded">Edit</button>
                <button onClick={async ()=>{await deleteDoc(doc(db, 'products', p.id)); setProducts(products.filter(x=>x.id!==p.id))}} className="bg-red-600 px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && <EditProductModal open={!!editing} onClose={() => setEditing(null)} product={editing} onUpdated={onUpdated} />}
    </div>
  )
}
