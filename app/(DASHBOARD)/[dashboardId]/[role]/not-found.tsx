// 'use client'

// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { AlertTriangle } from 'lucide-react'

// // Make sure this is the default export
// export default function NotFound() {
//   const router = useRouter()

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
//       <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
//       <h1 className="text-3xl font-semibold text-gray-800 mb-2">
//         Dashboard Not Found
//       </h1>
//       <p className="text-gray-600 mb-6">
//         The dashboard you're looking for doesn't exist or is no longer accessible.
//       </p>
//       <div className="flex gap-4">
//         <Button variant="outline" onClick={() => router.back()}>
//           Go Back
//         </Button>
//         <Button onClick={() => router.push('/')}>
//           Go to Home
//         </Button>
//       </div>
//     </div>
//   )
// }

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 py-12 text-center">
      <div className="max-w-xl">
        <div className="text-8xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow transition duration-300"
        >
          ⬅ Go Back Home
        </Link>
      </div>
    </div>
  );
}
