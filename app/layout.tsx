'use client';
 
import { useEffect } from 'react';
import { initMixpanel } from '@/lib/mixpanel';

import type React from "react"
//import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Head from "next/head"
const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "MobGSM - Latest Mobile Phones, Full Specs & Comparisons",
//   description: "Explore detailed specifications, reviews, and comparisons of the latest smartphones. Stay updated with mobile news and find the best device for your needs.",
//   keywords: "mobile phones, smartphone specs, phone comparisons, latest mobiles, tech reviews, MobGSM",
// }


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    console.log('Initializing Mixpanel...');
    initMixpanel(); // Initialize Mixpanel
  }, []);
  return (
    <html lang="en">
       <Head>
       <link
  rel="preload"
  href="/_next/static/css/6c2e098d8009e3e1.css"
  as="style"
  onLoad={(e) => {
    const link = e.currentTarget as HTMLLinkElement;
    link.rel = "stylesheet";
  }}
/>
<noscript>
  <link
    rel="stylesheet"
    href="/_next/static/css/6c2e098d8009e3e1.css"
  />
</noscript>


        {/* Preconnect to speed up S3 images */}
        <link rel="preload" href="/_next/static/css/ea3013c466b4c6eb.css" as="style" />
        <link rel="preconnect" href="https://s3.amazonaws.com" crossOrigin="" />
        
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
