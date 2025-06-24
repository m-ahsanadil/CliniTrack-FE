import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ProvidersWrapper } from "@/src/redux/providers/ProvidersWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CliniTrack - Medical Admin Dashboard",
  description: "A comprehensive medical admin dashboard for clinic management",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  )
}
