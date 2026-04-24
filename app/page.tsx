'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { MOCK_MERCHANTS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { ArrowRight } from 'lucide-react'

const TICKER_ITEMS = [
  "McDonald's", '·', 'Starbucks Coffee', '·', 'Indomaret', '·',
  'Poin Universal', '·', 'Belanja Cerdas', '·', 'Rewards Eksklusif', '·',
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [heroIndex, setHeroIndex] = useState(0)

  const heroSlides = MOCK_MERCHANTS.map((m) => ({
    image: m.heroImage,
    name: m.name,
    category: m.category,
    slug: m.slug,
    description: m.description,
    pointsMultiplier: m.pointsMultiplier,
  }))

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4)

  return (
    <div className="min-h-screen bg-white text-black">

      {/* ── HERO ── */}
      <section className="-mt-20 h-screen relative overflow-hidden">

        {/* Background slideshow */}
        <AnimatePresence>
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <motion.img
              src={heroSlides[heroIndex].image}
              alt={heroSlides[heroIndex].name}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: 'easeOut' }}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Hero text */}
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${heroIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-3">
                {heroSlides[heroIndex].category}
              </p>
              <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tight mb-5">
                {heroSlides[heroIndex].name}
              </h1>
              <p className="text-white/60 text-sm max-w-md mb-8 leading-relaxed">
                {heroSlides[heroIndex].description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/shop?merchant=${heroSlides[heroIndex].slug}`}
                  className="bg-[#0099FF] text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0088EE] transition-colors flex items-center gap-2"
                >
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/register"
                    className="border border-white/40 text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Join Free
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide progress bars */}
          <div className="absolute bottom-10 right-8 md:right-16 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className="relative h-px w-10 bg-white/25 overflow-hidden"
              >
                {i === heroIndex && (
                  <motion.div
                    key={`prog-${heroIndex}`}
                    className="absolute inset-0 bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-10 left-8 md:left-16 text-white/35 text-[10px] tracking-widest tabular-nums">
            {String(heroIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        >
          <div className="w-px h-10 bg-white/30" />
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#0099FF] py-3 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center flex-shrink-0">
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="text-white text-[11px] uppercase tracking-[0.2em] mx-6 flex-shrink-0"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── MERCHANT COLLECTIONS ── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Collections</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Merchant Pilihan</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest border-b border-black pb-0.5 hover:border-[#0099FF] hover:text-[#0099FF] transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_MERCHANTS.map((merchant, idx) => (
              <motion.div
                key={merchant.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={`/shop?merchant=${merchant.slug}`} className="block group">
                  <div className="relative overflow-hidden bg-[#EFEEED] aspect-[4/5]">
                    <motion.img
                      src={merchant.heroImage}
                      alt={merchant.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.6 }}
                      onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">{merchant.category}</p>
                      <p className="text-white font-bold uppercase tracking-tight">{merchant.name}</p>
                      <p className="text-[#0099FF] text-[11px] mt-1 uppercase tracking-widest">
                        {merchant.pointsMultiplier}× Points
                      </p>
                    </div>
                    {/* Points badge */}
                    <div className="absolute top-4 left-4 bg-[#0099FF] text-white text-[10px] px-2.5 py-1 uppercase tracking-widest">
                      {merchant.pointsMultiplier}× Pts
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-0.5">{merchant.category}</p>
                    <p className="font-bold uppercase text-sm tracking-tight">{merchant.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-black py-20 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: '1000+', label: 'Merchant Partners' },
            { value: '10M+', label: 'Transactions' },
            { value: '5M+', label: 'Active Users' },
            { value: '100%', label: 'Independent' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-white text-4xl md:text-5xl font-black mb-2">{stat.value}</p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-8 md:px-16 bg-[#EFEEED]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Shop</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Trending Now</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest border-b border-black pb-0.5 hover:border-[#0099FF] hover:text-[#0099FF] transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product, idx) => {
              const merchant = MOCK_MERCHANTS.find((m) => m.id === product.merchantId)
              const pts = Math.floor(product.price * (merchant?.pointsMultiplier ?? 1))
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="group"
                >
                  <Link href="/shop" className="block">
                    <div className="relative overflow-hidden bg-white aspect-square mb-3">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
                      <div className="absolute top-3 right-3 bg-[#0099FF] text-white text-[10px] px-2 py-0.5 uppercase tracking-wider">
                        +{pts} pts
                      </div>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">{merchant?.name}</p>
                    <p className="text-sm font-semibold leading-tight mb-1">{product.name}</p>
                    <p className="text-sm text-black/60">Rp {product.price.toLocaleString('id-ID')}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 md:hidden"
          >
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest border border-black py-3 hover:bg-black hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden bg-[#0099FF] py-32 px-8 md:px-16">
          <motion.div
            className="max-w-[1400px] mx-auto relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-4">Join Now</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white leading-none tracking-tight mb-10 max-w-3xl">
              Mulai Kumpulkan Poin Hari Ini
            </h2>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Daftar Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          {/* Decorative watermark */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[18vw] font-black text-white/10 uppercase leading-none pointer-events-none select-none">
            POIN
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-black text-white py-16 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest mb-5">NusaPoints</h3>
              <p className="text-white/35 text-xs leading-relaxed max-w-xs">
                Platform belanja dengan loyalitas poin universal untuk ribuan merchant di Indonesia.
              </p>
            </div>
            {[
              {
                heading: 'Shop',
                links: [{ label: 'All Merchants', href: '/shop' }, { label: "McDonald's", href: '/shop?merchant=mcdonalds' }, { label: 'Starbucks', href: '/shop?merchant=starbucks' }, { label: 'Indomaret', href: '/shop?merchant=indomaret' }],
              },
              {
                heading: 'Account',
                links: [{ label: 'Login', href: '/login' }, { label: 'Register', href: '/register' }, { label: 'My Points', href: '/points-history' }, { label: 'Profile', href: '/account' }],
              },
              {
                heading: 'Info',
                links: [{ label: 'About', href: '/' }, { label: 'Terms', href: '/' }, { label: 'Privacy', href: '/' }, { label: 'Contact', href: '/' }],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-[10px] uppercase tracking-widest text-white/35 mb-5">{col.heading}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-white/55 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-white/10">
            <p className="text-white/25 text-[10px] uppercase tracking-widest">
              © {new Date().getFullYear()} NusaPoints. All rights reserved.
            </p>
            <p className="text-white/25 text-[10px] uppercase tracking-widest mt-4 md:mt-0">
              Indonesia · IDR
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
