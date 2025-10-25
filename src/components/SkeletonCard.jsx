import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg bg-black/20 animate-pulse">
      <div className="h-40 bg-black/30 shimmer rounded-md" />
      <div className="mt-3 h-4 bg-black/20 shimmer rounded w-3/4" />
      <div className="mt-2 h-3 bg-black/20 shimmer rounded w-1/2" />
    </div>
  )
}
