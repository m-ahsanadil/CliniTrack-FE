'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardNotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        Dashboard Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        The dashboard you're looking for doesn't exist or is no longer accessible.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button onClick={() => router.push('/')}>
          Go to Home
        </Button>
      </div>
    </div>
  )
}
