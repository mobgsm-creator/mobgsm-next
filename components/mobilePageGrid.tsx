"use client";

import { useState, useEffect } from "react";
import Sidebar from "./mobilePageSidebar";
import Link from "next/link";
import Image from "next/image";
import { Device } from "@/lib/types";

type Props = {
  brands: string[];
  brandMap: Record<string, Device[]>;
};

export default function DevicesGrid({ brands, brandMap }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>("Nokia");

  useEffect(() => {
    const hashBrand = window.location.hash.replace("#", "");
    if (hashBrand && brands.includes(hashBrand)) {
      setSelectedBrand(hashBrand);
    }
  }, [brands]);

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    window.history.replaceState(null, "", `#${brand}`);
  };

  return (
    <div className="max-w-7xl mx-auto flex min-h-screen bg-gray-50">
      <Sidebar
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandClick={handleBrandClick}
      />

      <main className="flex-1 p-6 overflow-auto">
        {selectedBrand && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {brandMap[selectedBrand].map((device) => (
              <Link
                key={device.id}
                href={`/mobile/${device.name_url}`}
                className="group block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center hover:shadow-lg transition-transform transform hover:scale-105">
                  <Image
                    src={device.image}
                    alt={device.name}
                    className="max-h-full max-w-full object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                    fill
                  />
                </div>
                <div className="p-3 text-center text-black font-semibold group-hover:text-black text-sm sm:text-base">
                  {device.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
