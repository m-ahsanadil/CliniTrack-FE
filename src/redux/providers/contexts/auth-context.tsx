"use client";

import type React from "react"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "admin" | "doctor" | "staff"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
  specialization?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: Record<string, User & { password: string }> = {
  "admin@clinitrack.com": {
    id: "1",
    name: "Dr. Sarah Wilson",
    email: "admin@clinitrack.com",
    role: "admin",
    password: "admin123",
    avatar: "/placeholder-user.jpg",
    department: "Administration",
  },
  "doctor@clinitrack.com": {
    id: "2",
    name: "Dr. Michael Chen",
    email: "doctor@clinitrack.com",
    role: "doctor",
    password: "doctor123",
    avatar: "/placeholder-user.jpg",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
  },
  "staff@clinitrack.com": {
    id: "3",
    name: "Jennifer Martinez",
    email: "staff@clinitrack.com",
    role: "staff",
    password: "staff123",
    avatar: "/placeholder-user.jpg",
    department: "Reception",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("clinitrack_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("clinitrack_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = mockUsers[email.toLowerCase()]

    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword)
      localStorage.setItem("clinitrack_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("clinitrack_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
