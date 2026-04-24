'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product, Merchant } from '@/lib/types'
import { useCart } from '@/lib/contexts/CartContext'

interface ProductCardProps {
  product: Product
  merchant: Merchant
}

export default function ProductCard({ product, merchant }: ProductCardProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const estimatedPoints = Math.floor(product.price * quantity * merchant.pointsMultiplier)

  const handleAddToCart = () => {
    addToCart(product, merchant, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="relative w-full aspect-square overflow-hidden bg-[#EFEEED] mb-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
          />
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <p className="text-sm text-slate-600">{product.description}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-slate-900">
              Rp{product.price.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="bg-green-50 border border-green-200 p-2 rounded text-sm">
            <p className="text-slate-600">Poin yang didapat:</p>
            <p className="font-bold text-green-600">{estimatedPoints} poin</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-300 rounded transition"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-300 rounded transition"
            >
              +
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            className={`w-full transition ${
              isAdded
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isAdded ? '✓ Ditambahkan' : 'Tambah ke Keranjang'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
