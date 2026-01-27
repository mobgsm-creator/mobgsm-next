"use client"
import Image from "next/image"
import Link from "next/link"
import WalletPopup from "./Wallet"
import CountrySelector from "./CountrySelector"
import LoginButton from "./LoginButton"
import { Session } from "next-auth"

export default function HeaderClient({session, country, setCountry}: {session: Session, country: string, setCountry: (country: string) => void}) {
    return (
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
            <CountrySelector country={country} setCountry={setCountry}/></div>
          </div>
        </div>
      </header>
    )
}