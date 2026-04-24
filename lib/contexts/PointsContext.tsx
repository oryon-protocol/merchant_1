'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Transaction, PointsBalance } from '../types'
import { MOCK_TRANSACTIONS, MOCK_USER_POINTS_DATA } from '../mock-data'
import { useAuth } from './AuthContext'

interface PointsContextType {
  points: PointsBalance | null
  isLoading: boolean
  addTransaction: (transaction: Transaction) => void
  getTransactions: () => Transaction[]
  getTotalPoints: () => number
}

const PointsContext = createContext<PointsContextType | undefined>(undefined)

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [points, setPoints] = useState<PointsBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize points data from localStorage or mock data
  useEffect(() => {
    if (user) {
      const storedPoints = localStorage.getItem(`points-${user.id}`)
      if (storedPoints) {
        const parsedPoints = JSON.parse(storedPoints)
        setPoints(parsedPoints)
      } else {
        // Initialize with mock data for demo user
        const userTransactions = MOCK_TRANSACTIONS.filter(t => t.userId === user.id)
        const totalPoints = userTransactions.reduce((sum, t) => sum + t.pointsEarned, 0) + MOCK_USER_POINTS_DATA.totalPoints

        const pointsData: PointsBalance = {
          totalPoints,
          availablePoints: totalPoints,
          redeemedPoints: 0,
          transactions: userTransactions,
        }
        setPoints(pointsData)
        localStorage.setItem(`points-${user.id}`, JSON.stringify(pointsData))
      }
    } else {
      setPoints(null)
    }
    setIsLoading(false)
  }, [user])

  const addTransaction = (transaction: Transaction) => {
    if (!user || !points) return

    const updatedPoints: PointsBalance = {
      ...points,
      totalPoints: points.totalPoints + transaction.pointsEarned,
      availablePoints: points.availablePoints + transaction.pointsEarned,
      transactions: [transaction, ...points.transactions],
    }

    setPoints(updatedPoints)
    localStorage.setItem(`points-${user.id}`, JSON.stringify(updatedPoints))
  }

  const getTransactions = () => {
    return points?.transactions || []
  }

  const getTotalPoints = () => {
    return points?.totalPoints || 0
  }

  return (
    <PointsContext.Provider
      value={{
        points,
        isLoading,
        addTransaction,
        getTransactions,
        getTotalPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (context === undefined) {
    throw new Error('usePoints must be used within PointsProvider')
  }
  return context
}
