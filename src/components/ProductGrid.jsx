import React from 'react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list" aria-label="Product grid">
      {products.map(p => (
        <div role="listitem" key={p.id}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  )
}
