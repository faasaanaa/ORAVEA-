import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloating from './components/WhatsAppFloating'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import TrackOrder from './pages/TrackOrder'
import Feedback from './pages/Feedback'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Admin from './pages/admin/Admin'
import { useAuth } from './services/useAuth'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order/:orderId" element={<OrderConfirmation />} />
      <Route path="/track" element={<TrackOrder />} />
  <Route path="/feedback" element={<Feedback />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/admin/*" element={<AdminProtected><Admin /></AdminProtected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AdminProtected({ children }) {
  const { user, isAdmin, loading } = useAuth();

  // Show a temporary loading state while Firebase checks the session
  if (loading) return <div className="p-6 text-center">Checking admin access...</div>;

  // If user not logged in, push them to login (or homepage)
  if (!user) {
    console.log("⛔ No user — redirecting to home");
    return <Navigate to="/" replace />;
  }

  // If user logged in but not admin, block access
  if (!isAdmin) {
    console.log("🚫 Not admin:", user.email);
    return <Navigate to="/" replace />;
  }

  // If admin, show dashboard
  console.log("✅ Admin access granted:", user.email);
  return children;
}


export default function App() {
  return (
    <div className="min-h-screen bg-brand-black text-white font-poppins">
      <Header />
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <AppRoutes />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  )
}
