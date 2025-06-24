"use client"

import type React from "react"

import { useAppSelector } from "@/src/redux/store/reduxHook"
import { UserRole } from "@/src/constants"

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAppSelector(state => state.auth);


  if (!user || !allowedRoles.includes(user?.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
