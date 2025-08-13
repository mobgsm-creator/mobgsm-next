'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { getDevices } from '@/lib/supabase';

export const runtime = 'edge';

type Device = {
  id: number;
  name: string;
  name_url: string;
  brand_name: string;
  image: string;
};

export default function BlogListPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Fetch devices once
  useEffect(() => {
    const fetchDevices = async () => {
      const deviceData = await getDevices();
      setDevices(deviceData);
      setLoading(false);

      // On load, check if URL has #brand hash and select it
      const hashBrand = window.location.hash.replace('#', '');
      if (hashBrand && deviceData.some(d => d.brand_name === hashBrand)) {
        setSelectedBrand(hashBrand);
      } else if (deviceData.length > 0) {
        // default select first brand
        setSelectedBrand(deviceData[0].brand_name);
      }
    };

    fetchDevices();
  }, []);

  // Group devices by brand
  const brandMap: Record<string, Device[]> = devices.reduce((acc, device) => {
    if (!acc[device.brand_name]) acc[device.brand_name] = [];
    acc[device.brand_name].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

  // When user clicks brand, update state & URL hash
  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    window.history.replaceState(null, '', `#${brand}`);
  };

  if (loading) {
    return <div className="p-6">Loading devices...</div>;
  }

  return (
   
   <>
    <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 justify-center">
      <Image src="/MOBGSM-svg-vector.svg" alt="" width={40} height={40} />
    </div>
  </header>
  <div className="max-w-7xl mx-auto flex min-h-screen bg-gray-50">
  <nav className="w-48 bg-white border-r shadow-sm p-4 sticky top-0 h-screen overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Brands</h2>
        <ul className="space-y-2">
          {Object.keys(brandMap).map((brand) => (
            <li key={brand}>
              <button
                onClick={() => handleBrandClick(brand)}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedBrand === brand
                    ? 'bg-gray-50 text-black font-bold'
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                {brand}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area - show devices of selected brand */}
      <main className="flex-1 p-6 overflow-auto">
     
        {selectedBrand && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {brandMap[selectedBrand].map((device) => (
              <Link
                key={device.id}
                href={`/mobile/${device.name_url}`}
                className="group block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-48 bg-gray-100 hover:shadow-lg transition-transform transform hover:scale-105">
                  <Image
                    src={device.image}
                    alt={device.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority={true}
                  />
                </div>
                <div className="p-3 text-center text-black font-semibold group-hover:text-black">
                  {device.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div></>
  );
}
