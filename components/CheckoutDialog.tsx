'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCart } from '@/lib/contexts/CartContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Merchant, Transaction } from '@/lib/types'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: Merchant
}

export default function CheckoutDialog({
  open,
  onOpenChange,
  merchant,
}: CheckoutDialogProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems, getCartTotal, getCartPointsEstimate, clearCart } = useCart()
  const { addTransaction } = usePoints()
  const [step, setStep] = useState<'payment' | 'receipt'>('payment')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cash'>('card')

  const total = getCartTotal()
  const pointsEarned = getCartPointsEstimate()

  const handleProcessPayment = async () => {
    if (!user) return

    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create transaction record
    const transaction: Transaction = {
      id: `trans-${Date.now()}`,
      userId: user.id,
      merchantId: merchant.id,
      merchantName: merchant.name,
      amount: total,
      pointsEarned: pointsEarned,
      timestamp: new Date(),
      items: cartItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }

    // Add transaction to points context
    addTransaction(transaction)

    setIsProcessing(false)
    setStep('receipt')
  }

  const handleCloseDialog = () => {
    if (step === 'receipt') {
      clearCart()
      setStep('payment')
      setPaymentMethod('card')
      onOpenChange(false)
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'payment' ? 'Konfirmasi Pembayaran' : 'Pembayaran Berhasil'}
          </DialogTitle>
          <DialogDescription>
            {step === 'payment'
              ? 'Pilih metode pembayaran dan selesaikan transaksi'
              : 'Terima kasih atas pembelian Anda'}
          </DialogDescription>
        </DialogHeader>

        {step === 'payment' ? (
          <div className="space-y-4">
            {/* Order Summary */}
            <Card className="bg-slate-50 p-4">
              <p className="text-sm text-slate-600 mb-2">Ringkasan Pesanan</p>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp{total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </Card>

            {/* Points Info */}
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-sm text-slate-600">Poin yang akan didapat</p>
              <p className="text-2xl font-bold text-green-600">⭐ {pointsEarned}</p>
              <p className="text-xs text-slate-500 mt-1">
                ({merchant.pointsMultiplier} poin per Rp 1.000)
              </p>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Metode Pembayaran</p>
              {(['card', 'transfer', 'cash'] as const).map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-slate-50 transition"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as typeof method)
                    }
                  />
                  <span className="text-sm font-medium text-slate-900">
                    {method === 'card'
                      ? '💳 Kartu Kredit'
                      : method === 'transfer'
                        ? '🏦 Transfer Bank'
                        : '💵 Tunai'}
                  </span>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </div>
          </div>
        ) : (
          /* Receipt */
          <div className="space-y-4 text-center py-4">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Pembayaran Berhasil!
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Transaksi Anda telah diproses dengan sukses
              </p>
            </div>

            {/* Receipt Details */}
            <Card className="bg-slate-50 p-4 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Merchant</span>
                  <span className="font-semibold">{merchant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Belanja</span>
                  <span className="font-semibold">
                    Rp{total.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Metode Pembayaran</span>
                  <span className="font-semibold">
                    {paymentMethod === 'card'
                      ? 'Kartu Kredit'
                      : paymentMethod === 'transfer'
                        ? 'Transfer Bank'
                        : 'Tunai'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between bg-green-50 -m-4 p-4 rounded">
                  <span className="font-bold text-slate-900">Poin Terkumpul</span>
                  <span className="font-bold text-green-600 text-lg">
                    +{pointsEarned}
                  </span>
                </div>
              </div>
            </Card>

            {/* Close Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                handleCloseDialog()
              }}
            >
              Selesai
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
