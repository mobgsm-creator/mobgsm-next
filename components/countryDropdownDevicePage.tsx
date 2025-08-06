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
    <div className="bg-white mt-6">
      {/* Header acting as toggle */}
      <div
        className="bg-white px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-black">COUNTRIES</h3>
        <ChevronRight
          className={`h-4 w-4 text-black transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div>
          {Object.entries(settings).map(([code, cfg]) => (
            <a
              key={code}
              href={`https://mobgsm.com/listings/blog/${deviceSlug}-price-in-${cfg.country.replace(" ", "-")}`}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-gray-900 font-medium">{cfg.country || country}</span>
              <ChevronRight className="h-4 w-4 text-green-500" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
