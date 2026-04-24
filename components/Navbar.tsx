'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { useCart } from '@/lib/contexts/CartContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, User, LogOut, Home, Gift, Menu } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { getTotalPoints } = usePoints()
  const { cartItems } = useCart()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary hover:text-primary/80 transition">
            <Gift className="w-6 h-6" />
            <span>NusaPoints</span>
          </Link>

          {/* Navigation Links - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-muted-foreground hover:text-foreground transition flex items-center gap-2 text-sm font-medium">
                <Home className="w-4 h-4" />
                Belanja
              </Link>
              <Link href="/account" className="text-muted-foreground hover:text-foreground transition flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Akun
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                    <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  {cartItems.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </Link>

                {/* Points Display */}
                <motion.div 
                  className="hidden sm:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <Gift className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Poin</p>
                    <p className="font-bold text-foreground">{getTotalPoints().toLocaleString('id-ID')}</p>
                  </div>
                </motion.div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="text-muted-foreground cursor-default text-sm">
                      {user?.name}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/points-history" className="cursor-pointer flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        Riwayat Poin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild size="sm" className="text-sm">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
