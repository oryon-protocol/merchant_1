'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { MOCK_MERCHANTS } from '@/lib/mock-data'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  const { isAuthenticated } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Premium */}
      <section className="relative overflow-hidden pt-24 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Animated background shapes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 -z-10 overflow-hidden"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-20 right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"
            ></motion.div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-40 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            ></motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Platform Belanja dengan Loyalitas Poin Universal
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Belanja Cerdas,{' '}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Poin Berlipat
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Koleksi terbaik dari merchant favorit Anda dalam satu platform. Kumpulkan poin setiap transaksi dan tukar dengan reward menarik.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg hover:shadow-xl px-8">
                <Link href="/shop">
                  Mulai Belanja
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild size="lg" variant="outline" className="px-8">
                  <Link href="/register">Daftar Gratis</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Mengapa Memilih NusaPoints?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pengalaman belanja yang lebih rewarding dengan sistem poin universal
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: TrendingUp,
                title: 'Poin Berlipat Ganda',
                description: 'Setiap rupiah yang dibelanjakan otomatis masuk ke akun poin Anda tanpa batas',
              },
              {
                icon: Zap,
                title: 'Belanja di 1000+ Merchant',
                description: 'Akses eksklusif ke ribuan merchant partner terbaik di seluruh Indonesia',
              },
              {
                icon: Sparkles,
                title: 'Rewards Eksklusif',
                description: 'Nikmati bonus spesial dan hadiah menarik untuk member setia kami',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 bg-background border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Merchants */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Merchant Pilihan Kami</h2>
            <p className="text-muted-foreground text-lg">
              Belanja di merchant terbaik dan dapatkan poin untuk setiap transaksi
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {MOCK_MERCHANTS.map((merchant, idx) => (
              <motion.div
                key={merchant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Link href={`/shop?merchant=${merchant.slug}`} className="block h-full">
                  <div className="h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="relative h-56 bg-muted overflow-hidden">
                      <img
                        src={merchant.heroImage}
                        alt={merchant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{merchant.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{merchant.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{merchant.category}</span>
                        <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg">
                          {merchant.pointsMultiplier}x Poin
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl px-8">
              <Link href="/shop">Jelajahi Semua Merchant</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Mulai Kumpulkan Poin Hari Ini</h2>
                <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                  Bergabunglah dengan jutaan pengguna yang sudah mendapatkan keuntungan maksimal dari setiap belanja mereka.
                </p>
              </div>
              <div className="pt-4">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl px-8 font-semibold">
                  <Link href="/register">Daftar Gratis Sekarang</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
