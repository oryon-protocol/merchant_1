'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AccountPage() {
  const { user } = useAuth()
  const { points, getTotalPoints } = usePoints()

  if (!user) {
    return null
  }

  const totalPoints = getTotalPoints()
  const recentTransactions = points?.transactions.slice(0, 5) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Akun Saya</h1>
          <p className="text-slate-600">Kelola profil dan poin loyalitas Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">👤</span> Profil Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Nama Lengkap</p>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold text-slate-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Nomor Telepon</p>
                  <p className="font-semibold text-slate-900">{user.phone}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profil
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Points & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Points Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Points */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Total Poin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">⭐</div>
                    <div>
                      <p className="text-4xl font-bold text-blue-600">
                        {totalPoints.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-slate-600">poin tersedia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Count */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">📊</div>
                    <div>
                      <p className="text-4xl font-bold text-green-600">
                        {points?.transactions.length || 0}
                      </p>
                      <p className="text-sm text-slate-600">transaksi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaksi Terbaru</CardTitle>
                    <CardDescription>Riwayat belanja 5 transaksi terakhir</CardDescription>
                  </div>
                  <Link href="/points-history" className="text-blue-600 hover:underline text-sm font-semibold">
                    Lihat Semua
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((trans) => (
                      <div
                        key={trans.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{trans.merchantName}</p>
                          <p className="text-sm text-slate-600">
                            {trans.items.length} item • {new Date(trans.timestamp).toLocaleDateString('id-ID')}
                          </p>
                          <div className="mt-2 space-y-1">
                            {trans.items.map((item, idx) => (
                              <p key={idx} className="text-xs text-slate-600">
                                {item.productName} x{item.quantity}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            Rp{trans.amount.toLocaleString('id-ID')}
                          </p>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            +{trans.pointsEarned} poin
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">🛒</p>
                    <p className="text-slate-600">Belum ada transaksi</p>
                    <p className="text-sm text-slate-500 mt-1">Mulai berbelanja di merchant pilihan</p>
                    <Link href="/merchants">
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Mulai Belanja
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
