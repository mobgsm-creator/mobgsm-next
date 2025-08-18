import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Head from "next/head"
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
       <Head>
        {/* Preconnect to speed up S3 images */}
        <link rel="preconnect" href="https://s3.amazonaws.com" crossOrigin="" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
