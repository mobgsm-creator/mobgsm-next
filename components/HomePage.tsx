'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import ProductSectionWrapper from "@/components/ProductAndFilterSection"
import CountrySelector from "@/components/CountrySelector"
import type { Product, BNPLProvider, ESIMProvider, Device, reloadly } from "../lib/types"
import Link from "next/link"
import { Session } from "next-auth";
import WalletPopup from "./Wallet"
import FormPopup from "./formPopup"
import LoginButton from "./LoginButton"
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
  const [showForm, setShowForm] = useState(false)
  const [balance, setBalance] = useState<{ amount: number; currency: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false)

  // Load initial country from localStorage
  useEffect(() => {
     // Show popup after a short delay
     
    
    (async () => {
      const result = await getBalance();
      setBalance(result);
    })();
    const stored = localStorage.getItem("selectedCountry")
    if (stored) setCountry(stored)
    const timer = setTimeout(() => setIsOpen(true), 500)
    return () => clearTimeout(timer)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close popup"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="relative w-full h-auto">
              <img
                src="/image.png"
                alt="Test Games. Earn Cash. Win Phones."
                className="w-full h-auto block"
              />

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center whitespace-nowrap absolute bottom-[17%] left-[8%] h-[13%] w-[30%] text-[12px] sm:text-sm sm:bottom-24 sm:left-20 sm:h-12 md:w-60 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                aria-label="Start Testing & Earning"
              >
                <span className="block sm:hidden font-serif text-[clamp(10px,2vw,14px)]">Earn Now</span>
                <span className="hidden sm:block font-serif text-[clamp(10px,2vw,14px)]">Start Testing & Earning</span>

              </button>
              {showForm && (
                <FormPopup
                  onClose={() => setShowForm(false)}
                  currentProduct={"Test Games $19"}
                
                />
              )}
            </div>
          </div>
        </div>
      )}


    </div>
    </div>
  )
}
