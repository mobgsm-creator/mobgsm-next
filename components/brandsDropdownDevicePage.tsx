"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
interface DynamicCountryLinksProps {
  country: string | null;
  uniqueBrands: string[];

}

export default function DynamicBrandLinks({ country, uniqueBrands}: DynamicCountryLinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  //console.log(country)

  return (
    <div className="max-h-[160rem] bg-gwhite mt-6">
      {/* Header acting as toggle */}
      <div
        className="bg-white px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="mt-2 font-bold text-black">BRANDS</h2>
        <ChevronRight
          className={`h-4 w-4 text-black transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </div>
  
      {/* Dropdown list */}
      {!isOpen && (
        <div className="max-h-[23rem] overflow-y-auto"> {/* scrollable container */}
        {uniqueBrands.map((brand) => (
          <Link
            key={brand}
            href={`https://${country ? country + "." : ""}mobgsm.com/mobile/#${brand}`}
            className="flex items-center justify-between mb-1 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer rounded-2xl"
          >
            <span className="text-gray-900 font-medium">{brand}</span>
            <ChevronRight className="h-4 w-4 text-black" />
          </Link>
        ))}
      </div>
      )}
    </div>
  );
  
}
