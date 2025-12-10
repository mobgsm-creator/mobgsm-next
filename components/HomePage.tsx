'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
//uimport GamePopupClient from "./GamesPopup"
import ProductSectionWrapper from "@/components/ProductAndFilterSection"
import CountrySelector from "@/components/CountrySelector"
import type { Product, BNPLProvider, ESIMProvider, Device, reloadly } from "../lib/types"
import Link from "next/link"
import { Session } from "next-auth";
import WalletPopup from "./Wallet"
import LoginButton from "./LoginButton"
import HomeBanner from "./bannerHome"

type HomePageProps = {
  country_code: string
  products: Product[]
  bnpl: BNPLProvider[]
  esim: ESIMProvider[]
  airtime: reloadly[]
  giftcards: reloadly[]
  device_list: Device[]
  session: Session | null
}

export default function HomePageClient({
  country_code,
  products,
  bnpl,
  esim,
  airtime,
  giftcards,
  device_list,
  session
}: HomePageProps) {
  if (country_code === "unknown")
    { 
      country_code = "ae"
    }
  const [country, setCountry] = useState(country_code.toLocaleUpperCase() || "")
  
  const [balance, setBalance] = useState<{ amount: number; currency: string }[]>([]);
 
  // Load initial country from localStorage
  useEffect(() => {
     // Show popup after a short delay
     
    
    (async () => {
      const result = await getBalance();
      setBalance(result);
    })();
    const stored = localStorage.getItem("selectedCountry")
    if (stored) setCountry(stored)
  
  }, [])

  const getBalance = async () => {
    const res = await fetch(`/api/get_balance?email=${session?.user?.email}`);
    const data = await res.json();
  
    const balances: { amount: number; currency: string }[] = [];
  
    const credits = data.credit || [];
    const debits = data.debit || [];
  
    // index debits by currency for quick lookup
    const debitMap: Record<string, number> = {};
    for (const d of debits) {
      debitMap[d.currency] = (debitMap[d.currency] || 0) + d.amount;
    }
  
    for (const c of credits) {
      const debitAmount = debitMap[c.currency] || 0;
      balances.push({
        currency: c.currency,
        amount: c.amount - debitAmount,
      });
    }
  
    return balances;
  };
  
  
  // Example usage inside useEffect or handler


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
      <Link  href={`https://${country ? country + "." : ""}mobgsm.com`}>
        <Image
          src="/MOBGSM-svg-vector.svg"
          alt="MOBGSM Logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>
    </div>
    
          <div className="flex flex-row absolute top-7 right-4">
            {/* Balance Display */}
    {session?.user?.email ? (
    
        <WalletPopup session={session}/>
      ) : <LoginButton />}
      <div className='mx-2'>
            <CountrySelector country={country} setCountry={setCountry} /></div>
          </div>
        </div>
      </header>
  
      <HomeBanner />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductSectionWrapper
          country={country}
          products={products}
          bnpl={bnpl}
          esim={esim}
          airtime={airtime}
          giftcards={giftcards}
          device_list={device_list}
          session={session}
          balance={balance}
        
          
        />
      </div>
      {/* <GamePopupClient /> */}
      


    </div>

  )
}
