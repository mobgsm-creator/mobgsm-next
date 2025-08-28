// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MixpanelInit from "@/lib/initMixpanel"
import Script from 'next/script';
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MobGSM - Latest Mobile Phones, Full Specs & Comparisons",
  description: "Explore detailed specifications, reviews, and comparisons of the latest smartphones. Stay updated with mobile news and find the best device for your needs.",
  keywords: "mobile phones, smartphone specs, phone comparisons, latest mobiles, tech reviews, MobGSM",
  verification: {
    google: "JQheeawoDUxKzF_H3q_s3Ka8zkL1etgxhfXBSZVim7A", // Next.js-native way
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://s3.amazonaws.com" crossOrigin="" />
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="" />
      </head>
      <body>
        {/* Preconnect for faster S3/FlagCDN image loads */}
        

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C3SGSVDLL8"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C3SGSVDLL8');
          `}
        </Script>

        {/* Wrap children with Mixpanel */}
        <MixpanelInit>{children}</MixpanelInit>
      </body>
    </html>
  );
}

