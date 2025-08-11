"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
interface DynamicCountryLinksProps {

  uniqueBrands: string[];

}

export default function DynamicBrandLinks({ uniqueBrands}: DynamicCountryLinksProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-h-[160rem] bg-gray-50 mt-6">
      {/* Header acting as toggle */}
      <div
        className="bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mt-2 font-bold text-black">BRANDS</div>
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
            href={`https://mobgsm.com/listings/blog/#${brand}`}
            className="flex items-center justify-between mb-1 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer rounded-2xl"
          >
            <span className="text-gray-900 font-medium">{brand}</span>
            <ChevronRight className="h-4 w-4 text-red-500" />
          </Link>
        ))}
      </div>
      )}
    </div>
  );
  
}
