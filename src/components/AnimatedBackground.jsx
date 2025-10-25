import React from 'react'

export default function AnimatedBackground({ children, className = '' }) {
  return (
    <div className={`relative rounded overflow-hidden ${className}`}>
      {/* animated organic blobs layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* subtle translucent overlay + backdrop blur to soften blobs */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* content overlay (text etc) */}
      <div className="relative z-10 flex items-center justify-center text-center h-full">
        {children}
      </div>
    </div>
  )
}
