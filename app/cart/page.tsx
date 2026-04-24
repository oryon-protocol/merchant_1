'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/contexts/CartContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { MOCK_MERCHANTS } from '@/lib/mock-data'
import { Trash2, ShoppingBag, ArrowLeft, Lock } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartPointsEstimate } = useCart()
  const { isAuthenticated } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Masuk Diperlukan</h1>
          <p className="text-muted-foreground mb-8">Anda harus masuk untuk mengakses keranjang belanja dan melakukan pembelian.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/login">Masuk ke Akun</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-8">Belum ada produk di keranjang Anda. Mulai berbelanja sekarang!</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/shop">Lanjut Belanja</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-foreground">Keranjang Belanja</h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {cartItems.map((item, idx) => {
                const pointsEarned = Math.floor(
                  item.product.price * item.quantity * item.merchant.pointsMultiplier
                )

                return (
                  <motion.div
                    key={item.product.id}
                    variants={itemVariants}
                    className="bg-card rounded-2xl border border-border p-5 hover:border-primary/40 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-28 h-28 bg-muted rounded-xl overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{item.merchant.name}</p>
                        <h3 className="font-semibold text-foreground mb-2">{item.product.name}</h3>
                        <div className="flex items-baseline gap-3">
                          <span className="font-bold text-foreground">
                            Rp {item.product.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-lg">
                            +{Math.floor(item.product.price * item.merchant.pointsMultiplier)} Poin
                          </span>
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center border border-slate-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-semibold min-w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-600">Subtotal</p>
                          <p className="font-bold text-slate-900">
                            Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-emerald-600 font-semibold">
                            +{pointsEarned} Poin
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="sticky top-24 h-fit"
          >
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Pesanan</h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkir</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pajak</span>
                  <span>Rp 0</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    Rp {getCartTotal().toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-xs text-emerald-700 mb-1">Poin yang akan didapat</p>
                  <p className="text-xl font-bold text-emerald-700">
                    {getCartPointsEstimate()} Poin
                  </p>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                asChild
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-semibold"
              >
                <Link href="/checkout">Lanjut ke Pembayaran</Link>
              </Button>

              {/* Continue Shopping */}
              <Button
                asChild
                variant="outline"
                className="w-full mt-3"
              >
                <Link href="/shop">Lanjut Belanja</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
