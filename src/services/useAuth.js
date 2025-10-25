import { useEffect, useState } from 'react'
import { auth, provider, signInWithPopup, fbSignOut } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { firstOrFallback } from '../utils/envLists'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (err) {
      console.error('Login error', err)
      throw err
    }
  }

  const signOut = async () => {
    await fbSignOut(auth)
  }

  // Support multiple admin emails via VITE_ADMIN_EMAILS (comma-separated) with fallback to VITE_ADMIN_EMAIL
  const adminEmails = firstOrFallback('VITE_ADMIN_EMAILS', 'VITE_ADMIN_EMAIL')
  const isAdmin = !!user?.email && adminEmails.some(e => e.toLowerCase() === user.email.toLowerCase())

  return { user, loading, loginWithGoogle, signOut, isAdmin }
}
