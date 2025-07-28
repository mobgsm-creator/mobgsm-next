'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Menu, Search,ChevronDown, ChevronUp } from 'lucide-react';

type Device = {
  id: number;
  name: string;
  name_url: string;
  brand_name: string;
};

export default function BlogListPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchDevices = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('devices')
        .select('id, name_url, name, brand_name');
      console.log(data)
      if (!error && data) {
        setDevices(data);
      }

      setLoading(false);
    };

    fetchDevices();
  }, []);

  const toggleBrand = (brand: string) => {
    setExpandedBrands((prev) => ({
      ...prev,
      [brand]: !prev[brand],
    }));
  };

  // Group devices by brand
  const brandMap: Record<string, Device[]> = devices.reduce((acc, device) => {
    if (!acc[device.brand_name]) acc[device.brand_name] = [];
    acc[device.brand_name].push(device);
    return acc;
  }, {} as Record<string, Device[]>);
 console.log(brandMap)
  if (loading) {
    return <div className="p-6">Loading devices...</div>;
  }

  return (
    <div className='flex justify-center items-center'>
    <div className="min-h-screen max-w-4xl bg-white">
      {/* Header */}
      <header className="bg-[#4CAF50] text-white px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Menu className="h-6 w-6" />
          <h1 className="text-2xl font-bold">MobGsm</h1>
          <Search className="h-6 w-6" />
        </div>
      </header></div>
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Device Brands</h1>
      <ul className="space-y-4">
        {Object.entries(brandMap).map(([brand, devices]) => (
          <li key={brand} className="border-b pb-2">
            <button
              onClick={() => toggleBrand(brand)}
              className="flex items-center text-left w-full text-lg font-semibold text-green-700 hover:text-green-900"
            >
              {expandedBrands[brand] ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              {brand}
            </button>

            {expandedBrands[brand] && (
              <ul className="ml-6 mt-2 space-y-1 text-sm text-blue-600">
                {devices.map((device) => (
                  <li key={device.id}>
                    <Link href={`/blog/${device.name_url}`} className="hover:underline">
                      {device.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div></div>
  );
}
