'use client'

import Link from 'next/link'
import { MOCK_MERCHANTS } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function MerchantsPage() {
  const featuredMerchants = MOCK_MERCHANTS.filter(m => m.featured)
  const otherMerchants = MOCK_MERCHANTS.filter(m => !m.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Belanja di Merchant Pilihan</h1>
          <p className="text-lg text-slate-600">Kumpulkan poin dari setiap pembelian dan tukarkan dengan hadiah menarik</p>
        </div>

        {/* Featured Merchants */}
        {featuredMerchants.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span>⭐</span> Merchant Unggulan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMerchants.map((merchant) => (
                <Link key={merchant.id} href={`/merchants/${merchant.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-amber-200 bg-gradient-to-br from-white to-amber-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-5xl mb-3">{merchant.logo}</div>
                          <CardTitle className="text-xl">{merchant.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{merchant.description}</CardDescription>
                        </div>
                        <Badge className="bg-blue-600">{merchant.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-slate-600">Poin per IDR</p>
                          <p className="font-bold text-lg text-green-600">{merchant.pointsMultiplier} poin</p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Belanja
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Merchants */}
        {otherMerchants.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Semua Merchant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherMerchants.map((merchant) => (
                <Link key={merchant.id} href={`/merchants/${merchant.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-5xl mb-3">{merchant.logo}</div>
                          <CardTitle className="text-xl">{merchant.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{merchant.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{merchant.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-slate-600">Poin per IDR</p>
                          <p className="font-bold text-lg text-green-600">{merchant.pointsMultiplier} poin</p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Belanja
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
