'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
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
  //Fix this security issue
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
    <>
    <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Image src="/listings/MOB GSM svg vector.svg" alt="" width={40} height={40} />
          
        </div>
      </header>
    <div className='flex flex-col justify-center items-center'>

  {/* Header */}
  

  {/* Main content */}
  <div className="p-6 max-w-4xl w-full">
    <h1 className="text-2xl font-bold mb-4">Device Brands</h1>
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(brandMap).map(([brand, devices]) => (
        <li key={brand} className="border p-3 rounded shadow-sm">
          <button
            onClick={() => toggleBrand(brand)}
            className="flex items-center text-left w-full text-lg font-semibold text-gray-800 hover:text-green-900"
          >
            {expandedBrands[brand] ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {brand}
          </button>

          {expandedBrands[brand] && (
            <ul className="mt-2 space-y-1 text-sm text-blue-600">
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
  </div>
</div></>

  );
}
