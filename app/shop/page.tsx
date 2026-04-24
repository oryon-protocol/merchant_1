'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MOCK_MERCHANTS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, Star, ShoppingCart, ChevronDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useCart } from '@/lib/contexts/CartContext'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const merchantFilter = searchParams.get('merchant')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(merchantFilter)
  const [showFilters, setShowFilters] = useState(false)

  // Filter products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCategory = !selectedCategory || product.category === selectedCategory
      const matchMerchant = !selectedMerchant || product.merchantId === selectedMerchant

      return matchSearch && matchCategory && matchMerchant
    })
  }, [searchTerm, selectedCategory, selectedMerchant])

  const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-6 px-4 sm:px-6 lg:px-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Belanja</h1>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} produk ditemukan
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari produk atau merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 bg-background border-border"
            />
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Sidebar Filters - Desktop */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden lg:block w-full lg:w-80 flex-shrink-0"
        >
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-32">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Filter</h2>
              {(selectedMerchant || selectedCategory) && (
                <button
                  onClick={() => {
                    setSelectedMerchant(null)
                    setSelectedCategory(null)
                  }}
                  className="text-sm text-primary hover:text-primary/80 transition"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Merchant Filter */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Merchant</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMerchant(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedMerchant === null
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Semua Merchant
                  </button>
                  {MOCK_MERCHANTS.map((merchant) => (
                    <button
                      key={merchant.id}
                      onClick={() => setSelectedMerchant(merchant.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedMerchant === merchant.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {merchant.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Kategori</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedCategory === null
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedCategory === cat
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Products Grid */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0"
        >
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-2xl border border-border">
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg">Produk tidak ditemukan</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory(null)
                    setSelectedMerchant(null)
                  }}
                  className="mx-auto"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => {
                const merchant = MOCK_MERCHANTS.find(m => m.id === product.merchantId)
                const pointsEarned = Math.floor(product.price * (merchant?.pointsMultiplier || 0))

                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all h-full flex flex-col">
                      {/* Product Image */}
                      <div className="relative h-52 md:h-60 bg-muted overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg">
                          {merchant?.pointsMultiplier}x Poin
                        </div>
                        {product.sold && product.sold > 1000 && (
                          <div className="absolute bottom-3 left-3 bg-foreground/80 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg">
                            Laku {(product.sold / 1000).toFixed(1)}rb+
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Merchant */}
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                          {merchant?.name}
                        </p>

                        <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(product.rating!) ? 'fill-amber-400 text-amber-400' : 'text-border'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">({product.sold})</span>
                          </div>
                        )}

                        {/* Price and Points */}
                        <div className="mt-auto space-y-3 pt-4 border-t border-border">
                          <div className="flex items-baseline justify-between">
                            <span className="text-base font-bold text-foreground">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg text-xs font-bold">
                            <span>+{pointsEarned}</span>
                            <span className="text-primary/80">Poin</span>
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart / Login Button */}
                      <div className="px-5 pb-5">
                        {isAuthenticated ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (merchant) {
                                addToCart(product, merchant, 1)
                              }
                            }}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Tambah Keranjang
                          </motion.button>
                        ) : (
                          <Link href="/login" className="w-full block">
                            <button className="w-full bg-muted hover:bg-muted/80 text-foreground py-3 px-4 text-sm font-semibold rounded-lg transition-all">
                              Masuk untuk Beli
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </motion.main>
      </div>
    </div>
  )
}
