'use client'

import { useState } from 'react'
import { MOCK_MERCHANTS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { Merchant, Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/lib/contexts/CartContext'
import ProductCard from '@/components/ProductCard'
import CartSidebar from '@/components/CartSidebar'

export default function MerchantDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const merchant = MOCK_MERCHANTS.find((m) => m.id === params.id)
  const products = MOCK_PRODUCTS.filter((p) => p.merchantId === params.id)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { cartItems } = useCart()

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">😞</p>
          <h1 className="text-2xl font-bold text-slate-900">Merchant tidak ditemukan</h1>
        </div>
      </div>
    )
  }

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Merchant Header */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-6xl">{merchant.logo}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{merchant.name}</h1>
              <p className="text-lg text-slate-600 mb-4">{merchant.description}</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-slate-600">Kategori</p>
                  <p className="font-bold text-slate-900">{merchant.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Poin per IDR</p>
                  <p className="font-bold text-green-600 text-lg">{merchant.pointsMultiplier}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Kategori Produk:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('')}
                  className={selectedCategory === '' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  Semua
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} merchant={merchant} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-slate-600">Tidak ada produk di kategori ini</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="hidden lg:block w-80">
            <CartSidebar merchant={merchant} />
          </div>
        </div>

        {/* Mobile Cart Button */}
        <div className="lg:hidden fixed bottom-6 right-6">
          <div className="flex flex-col gap-2">
            {cartItems.length > 0 && (
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
