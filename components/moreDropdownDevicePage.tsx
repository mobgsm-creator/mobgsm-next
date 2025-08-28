"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
type Device = {
    name: string;
    image: string;
    main_price: string;
  };
interface DynamicCountryLinksProps {

  more: Device[];
  brand: string;
}

export default function DynamicMoreLinks({ more, brand}: DynamicCountryLinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  //console.log(brand, more)
  return (
    <div className="max-h-[160rem] bg-gray-50 mt-6">
      {/* Header acting as toggle */}
      <div
        className="bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="mt-2 font-bold text-black">MORE FROM {brand.toUpperCase()}</h2>
        <ChevronRight
          className={`h-4 w-4 text-black transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </div>
  
      {/* Dropdown list */}
      {!isOpen && (
        <div className="max-h-[22rem] overflow-y-auto"> {/* scrollable container */}
          {more.map((dev, index) => (
                  <Link
                    key={index}
                    className="flex items-center justify-between mb-1 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer rounded-2xl"
                    href={`https://mobgsm.com/mobile/${dev.name.replace(/\s+/g, '-').toLowerCase()}` }
                  >
                    <span className="text-gray-900 font-medium">{dev.name}</span>
                    <ChevronRight className="h-4 w-4 text-red-500" />
                  </Link>
                ))}
        </div>
      )}
    </div>
  );
  
}
