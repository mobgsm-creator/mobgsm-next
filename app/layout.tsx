import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MobGSM - Latest Mobile Phones, Full Specs & Comparisons",
  description: "Explore detailed specifications, reviews, and comparisons of the latest smartphones. Stay updated with mobile news and find the best device for your needs.",
  keywords: "mobile phones, smartphone specs, phone comparisons, latest mobiles, tech reviews, MobGSM",
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
