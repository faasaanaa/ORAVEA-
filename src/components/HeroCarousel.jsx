import React, { useEffect, useState } from 'react'
import AnimatedBackground from './AnimatedBackground'

// Fallback to reliable picsum placeholders (organic-themed seeds) so images load without local files.
const IMAGES = [
  'https://picsum.photos/seed/organic1/1920/1080',
  'https://picsum.photos/seed/organic2/1920/1080',
  'https://picsum.photos/seed/organic3/1920/1080',
  'https://picsum.photos/seed/organic4/1920/1080',
  'https://picsum.photos/seed/organic5/1920/1080',
  'https://picsum.photos/seed/organic6/1920/1080',
  'https://picsum.photos/seed/organic7/1920/1080'
]

export default function HeroCarousel({ className, children }) {
  const [idx, setIdx] = useState(0)
  // Use the reliable picsum sources so images show without requiring local files
  const [sources] = useState(IMAGES)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % sources.length), 4500)
    return () => clearInterval(t)
  }, [sources])

  return (
    <div className={`relative overflow-hidden rounded-md bg-black ${className || ''}`}>
      {sources.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`hero-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      ))}

      {/* animated organic blur overlay on top of images */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedBackground className="w-full h-full" />
      </div>

      {/* content placed above the overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
        {children}
      </div>
    </div>
  )
}
