import React from 'react'
import PropTypes from 'prop-types'

import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.28 }} className="bg-brand-black-2 p-4 rounded max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

Modal.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, children: PropTypes.node }
