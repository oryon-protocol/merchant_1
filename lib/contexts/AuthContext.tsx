'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'
import { MOCK_USERS } from '../mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - find user in mock data
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error('Email atau password salah')
    }

    const userWithoutPassword = { ...foundUser }
    delete userWithoutPassword.password

    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    // Mock register - check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email)

    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    // Create new user (in real app, this would be sent to backend)
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      phone,
    }

    const userWithoutPassword = { ...newUser }
    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
