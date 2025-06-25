import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopClues Deals - Best Products with 75% Off",
  description: "Discover amazing deals with up to 75% off on top products. Shop now and save big!",
  keywords: "deals, discounts, shopping, 75% off, best prices",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
