import { useEffect, useState } from 'react'
import { auth, provider, signInWithPopup, fbSignOut } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

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

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL

  return { user, loading, loginWithGoogle, signOut, isAdmin }
}
