/**
 * Simple seed script that uses Firebase client SDK.
 * Ensure .env variables are set (VITE_*). For local node, read from process.env.
 */
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc } = require('firebase/firestore')
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  const products = [
  { name: 'Organic Olive Oil', price: 19.99, currency: 'Rs', shortDescription: 'Cold pressed olive oil', longDescription: 'Premium extra virgin olive oil.', specs: { weight: '500ml', origin: 'Spain' }, images: ['https://picsum.photos/seed/olive/600/400'], stock: 12, category: 'Oils', tags: ['olive','oil'] },
  { name: 'Herbal Tea Mix', price: 9.99, currency: 'Rs', shortDescription: 'Soothing herbal blend', longDescription: 'A mix of chamomile and mint.', specs: { weight: '200g' }, images: ['https://picsum.photos/seed/tea/600/400'], stock: 3, category: 'Beverages', tags: ['tea','herbal'] },
  { name: 'Organic Honey', price: 14.5, currency: 'Rs', shortDescription: 'Raw wild honey', longDescription: 'Unfiltered raw honey.', specs: { weight: '400g' }, images: ['https://picsum.photos/seed/honey/600/400'], stock: 0, category: 'Sweeteners', tags: ['honey'] },
  { name: 'Natural Soap', price: 5.5, currency: 'Rs', shortDescription: 'Handmade soap bar', longDescription: 'Gentle and moisturizing.', specs: { weight: '120g' }, images: ['https://picsum.photos/seed/soap/600/400'], stock: 6, category: 'Bath', tags: ['soap'] },
  ]

  for (const p of products) {
    await addDoc(collection(db, 'products'), { ...p, createdAt: new Date() })
    console.log('Added', p.name)
  }
  console.log('Seeding complete')
}

seed().catch(console.error)
