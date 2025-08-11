"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
interface Setting {
    titleindex: string
    descriptionindex: string
    keywordsindex: string
    country: string
    symbol: string
    currency: string
    exchangerates: string
    brandconten: string
    titlenews: string
    descriptionnews: string
    keywordsnews: string
    titledevices: string
    descriptiondevices: string
    keywordsdevices: string
  }
interface DynamicCountryLinksProps {
  deviceSlug: string;
  country: string | null;
  settings: Record<string, Setting>
}

export default function DynamicCountryLinks({ deviceSlug, country, settings }: DynamicCountryLinksProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-h-[160rem] bg-gray-50 mt-6">
      {/* Header acting as toggle */}
      <div
        className="bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mt-2 font-bold text-black">COUNTRIES</div>
        <ChevronRight
          className={`h-4 w-4 text-black transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </div>
  
      {/* Dropdown list */}
      {isOpen && (
        <div className="max-h-[116rem] overflow-y-auto"> {/* scrollable container */}
          {Object.entries(settings)
             // limit to 15 countries
       
            .map(([code, cfg]) => (
              <a
                key={code}
                href={`https://mobgsm.com/listings/blog/${deviceSlug}-price-in-${cfg.country.replace(" ", "-")}`}
                className="flex items-center justify-between mb-1 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer rounded-2xl"
              >
                <span className="text-gray-900 font-medium">
                  {cfg.country || country}
                </span>
                <ChevronRight className="h-4 w-4 text-green-500" />
              </a>
            ))}
        </div>
      )}
    </div>
  );
  
}
