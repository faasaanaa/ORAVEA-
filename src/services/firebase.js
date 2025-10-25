import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth'
import { getFirestore, serverTimestamp, doc, collection, getDoc, setDoc, addDoc, runTransaction } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, provider, signInWithPopup, fbSignOut, db, serverTimestamp, doc, collection, getDoc, setDoc, addDoc, runTransaction, storage, storageRef, uploadBytes, getDownloadURL }
