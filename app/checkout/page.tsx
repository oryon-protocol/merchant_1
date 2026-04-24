'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/contexts/CartContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getCartTotal, getCartPointsEstimate, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { addTransaction } = usePoints()
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form')
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string>('')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Masuk Diperlukan</h1>
          <p className="text-slate-600 mb-6">Anda harus masuk untuk menyelesaikan pembelian.</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/login">Masuk ke Akun</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Keranjang Kosong</h1>
          <p className="text-slate-600 mb-6">Belum ada produk di keranjang Anda.</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/shop">Kembali ke Toko</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.address && formData.city && formData.postalCode) {
      setStep('payment')
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      const newOrderId = `ORD-${Date.now()}`
      setOrderId(newOrderId)

      // Create transaction record
      const pointsEarned = getCartPointsEstimate()
      addTransaction({
        id: newOrderId,
        userId: user!.id,
        merchantId: cartItems[0]?.merchant.id || 'unknown',
        merchantName: cartItems[0]?.merchant.name || 'Mixed Merchants',
        amount: getCartTotal(),
        pointsEarned,
        timestamp: new Date(),
        items: cartItems.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })

      clearCart()
      setStep('success')
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {step !== 'success' && (
            <button
              onClick={() => step === 'payment' ? setStep('form') : router.back()}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 'payment' ? 'Kembali ke Form' : 'Kembali'}
            </button>
          )}
          <h1 className="text-3xl font-bold text-slate-900">
            {step === 'success' ? 'Pesanan Berhasil' : 'Checkout'}
          </h1>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {step === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center bg-white rounded-lg border border-slate-200 p-12"
            >
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Pesanan Diterima!</h2>
              <p className="text-slate-600 mb-4">
                Terima kasih atas pembelian Anda. Pesanan Anda telah berhasil diproses.
              </p>

              <div className="bg-slate-50 rounded-lg p-6 my-8 text-left">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nomor Pesanan</span>
                    <span className="font-bold text-slate-900">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Pembayaran</span>
                    <span className="font-bold text-slate-900">
                      Rp {getCartTotal().toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-slate-600">Poin Diterima</span>
                    <span className="font-bold text-emerald-600 text-lg">
                      +{getCartPointsEstimate()} Poin
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/shop">Lanjut Belanja</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/account">Lihat Akun Saya</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                {step === 'form' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg border border-slate-200 p-8"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Pengiriman</h2>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Nama Lengkap
                        </label>
                        <Input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          placeholder="Nama lengkap Anda"
                          className="w-full"
                        />
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="Email Anda"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            No. Telepon
                          </label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            placeholder="No. telepon"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Alamat Lengkap
                        </label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                          placeholder="Jalan, nomor, blok, unit, dst."
                          rows={3}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                        />
                      </div>

                      {/* City & Postal */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Kota
                          </label>
                          <Input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                            placeholder="Kota Anda"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Kode Pos
                          </label>
                          <Input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            required
                            placeholder="Kode pos"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-semibold"
                      >
                        Lanjut ke Pembayaran
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg border border-slate-200 p-8"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Metode Pembayaran</h2>

                    <div className="space-y-4 mb-8">
                      {[
                        { id: 'credit-card', label: 'Kartu Kredit', desc: 'Visa, Mastercard, Amex' },
                        { id: 'debit-card', label: 'Kartu Debit', desc: 'Debit Bank' },
                        { id: 'e-wallet', label: 'E-Wallet', desc: 'GoPay, OVO, DANA' },
                        { id: 'transfer', label: 'Transfer Bank', desc: 'Transfer manual ke rekening kami' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                          style={{
                            borderColor: paymentMethod === method.id ? '#4F46E5' : '#E2E8F0',
                            backgroundColor: paymentMethod === method.id ? '#F0F4FF' : 'transparent',
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4"
                          />
                          <div className="ml-4">
                            <p className="font-semibold text-slate-900">{method.label}</p>
                            <p className="text-sm text-slate-600">{method.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold disabled:opacity-50"
                    >
                      {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="sticky top-24 h-fit"
              >
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Ringkasan Pesanan</h3>

                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">{item.product.name}</span>
                          <span className="font-semibold text-slate-900">x{item.quantity}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-xs">
                          <span>Rp {item.product.price.toLocaleString('id-ID')}</span>
                          <span>
                            Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Ongkir</span>
                      <span>Gratis</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-lg font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-indigo-600">Rp {getCartTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-xs text-emerald-700 mb-1">Poin yang akan didapat</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {getCartPointsEstimate()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
