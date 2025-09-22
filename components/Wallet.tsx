// WalletPopup.tsx
'use client'

import { useState } from 'react'
import { Wallet } from 'lucide-react'

interface WalletPopupProps {
  balance: { amount: number; currency: string }[]
}

export default function WalletPopup({ balance }: WalletPopupProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-2xl shadow-sm border cursor-pointer mt-2"
        onClick={() => setOpen(!open)}
      >
        <Wallet className="w-5 h-5 text-black" />
        
      </div>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white border shadow-lg rounded p-4 w-48 z-50">
          <p className="text-sm font-semibold">Wallet Details</p>
          {balance.map((b, idx) => (
            <p key={idx} className="text-sm">{b.amount} {b.currency}</p>
          ))}
        </div>
      )}
    </div>
  )
}
