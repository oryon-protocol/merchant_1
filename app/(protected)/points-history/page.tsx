'use client'

import { useState } from 'react'
import { usePoints } from '@/lib/contexts/PointsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function PointsHistoryPage() {
  const { points, getTotalPoints } = usePoints()
  const [selectedMerchant, setSelectedMerchant] = useState<string>('')
  
  const totalPoints = getTotalPoints()
  const transactions = points?.transactions || []

  // Get unique merchants from transactions
  const merchants = Array.from(
    new Map(
      transactions.map((t) => [t.merchantId, t.merchantName])
    ).entries()
  )

  // Filter transactions
  const filteredTransactions = selectedMerchant
    ? transactions.filter((t) => t.merchantId === selectedMerchant)
    : transactions

  // Calculate stats
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalPointsEarned = filteredTransactions.reduce((sum, t) => sum + t.pointsEarned, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Riwayat Poin Loyalitas</h1>
          <p className="text-slate-600">Lihat semua transaksi dan poin yang telah Anda kumpulkan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Total Poin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {totalPoints.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-slate-600">poin tersedia untuk ditukar</p>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">Total Belanja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600 mb-2">
                Rp{totalSpent.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-slate-600">{filteredTransactions.length} transaksi</p>
            </CardContent>
          </Card>

          {/* Points Earned */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg">Poin Diperoleh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 mb-2">
                {totalPointsEarned.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-slate-600">dari semua transaksi</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <Card className="lg:col-span-1 h-fit sticky top-24">
            <CardHeader>
              <CardTitle>Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={selectedMerchant === '' ? 'default' : 'outline'}
                className={`w-full justify-start ${selectedMerchant === '' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                onClick={() => setSelectedMerchant('')}
              >
                Semua Merchant
              </Button>
              {merchants.map(([id, name]) => (
                <Button
                  key={id}
                  variant={selectedMerchant === id ? 'default' : 'outline'}
                  className={`w-full justify-start ${selectedMerchant === id ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => setSelectedMerchant(id)}
                >
                  {name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Transaksi</CardTitle>
                <CardDescription>
                  Menampilkan {filteredTransactions.length} transaksi
                  {selectedMerchant && ` dari ${merchants.find(([id]) => id === selectedMerchant)?.[1]}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 border rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Transaction Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">🏪</span>
                              <div>
                                <h3 className="font-bold text-slate-900">
                                  {transaction.merchantName}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  {new Date(transaction.timestamp).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}{' '}
                                  • {new Date(transaction.timestamp).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Items List */}
                            <div className="ml-10 space-y-1 mb-3">
                              {transaction.items.map((item, idx) => (
                                <p key={idx} className="text-sm text-slate-600">
                                  • {item.productName} x{item.quantity} @ Rp{item.price.toLocaleString('id-ID')}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Amount & Points */}
                          <div className="md:text-right space-y-2">
                            <div>
                              <p className="text-sm text-slate-600">Total Belanja</p>
                              <p className="text-xl font-bold text-slate-900">
                                Rp{transaction.amount.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <Badge className="block text-center bg-green-100 text-green-800 border border-green-300 font-semibold">
                              +{transaction.pointsEarned} poin
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-slate-600 font-medium">Tidak ada transaksi</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {selectedMerchant
                        ? 'Tidak ada transaksi di merchant ini'
                        : 'Mulai belanja untuk mengumpulkan poin'}
                    </p>
                    <Link href="/merchants">
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Belanja Sekarang
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
