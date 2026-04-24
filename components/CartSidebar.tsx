'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Merchant } from '@/lib/types'
import { useCart } from '@/lib/contexts/CartContext'
import CheckoutDialog from './CheckoutDialog'

interface CartSidebarProps {
  merchant: Merchant
}

export default function CartSidebar({ merchant }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartPointsEstimate, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  if (cartItems.length === 0) {
    return (
      <Card className="sticky top-24 bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle>Keranjang Belanja</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-3xl mb-2">🛒</p>
          <p className="text-slate-600">Keranjang kosong</p>
          <p className="text-sm text-slate-500 mt-2">Tambahkan produk untuk memulai</p>
        </CardContent>
      </Card>
    )
  }

  const total = getCartTotal()
  const pointsEstimate = getCartPointsEstimate()

  return (
    <>
      <Card className="sticky top-24 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <span>🛒</span> Keranjang Belanja
          </CardTitle>
          <p className="text-sm text-slate-600 font-normal">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg p-3 border border-blue-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      Rp{item.product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-700 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-6 h-6 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded text-sm"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="w-6 h-6 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded text-sm"
                  >
                    +
                  </button>
                </div>

                <p className="text-xs text-green-600 font-semibold mt-2">
                  {Math.floor(
                    item.product.price * item.quantity * merchant.pointsMultiplier
                  )}{' '}
                  poin
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-blue-300 pt-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>Rp{total.toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-green-100 border border-green-300 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">
                  Poin yang didapat:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ⭐ {pointsEstimate}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                clearCart()
              }}
            >
              Kosongkan
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowCheckout(true)}
            >
              Checkout
            </Button>
          </div>
        </CardContent>
      </Card>

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        merchant={merchant}
      />
    </>
  )
}
