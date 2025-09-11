import Image from "next/image";
import fs from 'fs';
import path from 'path';
import { Device } from "@/lib/types"
import DevicesGrid from "@/components/mobilePageGrid";
import Link from "next/link";
import { headers } from 'next/headers'
const devicesJSONPath = path.join(process.cwd(), 'public', 'devices.json');
const devicesData = JSON.parse(fs.readFileSync(devicesJSONPath, 'utf-8'));

// export const runtime = "edge";

export default async function BlogListPage() {
  const reqHeaders = headers()
  const host =
  reqHeaders.get("x-forwarded-host") ||
  reqHeaders.get("host") ||
  "";
  // Split hostname by dots
  const parts = host.split(".");
  // If it has a subdomain (like "in.mobgsm.com"), take the first part
  // If it's just "mobgsm.com", then no country subdomain exists
  let country_domain: string | null = null;
  if (parts[0].length === 2) {
    country_domain = parts[0]; // "in" from "in.mobgsm.com"
  }
  const devices: Device[] = Object.values(devicesData) as Device[];
  // Group devices by brand (on the server)
  const brandMap: Record<string, typeof devices> = devices.reduce((acc, device) => {
    if (!acc[device.brand_name]) acc[device.brand_name] = [];
    acc[device.brand_name].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);
  const brands = Object.keys(brandMap);
  // Default brand = first key


  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 justify-center">
        <Link  href={`https://${country_domain ? country_domain + "." : ""}mobgsm.com`}>
        <Image
          src="/MOBGSM-svg-vector.svg"
          alt="MOBGSM Logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>
        </div>
      </header>

      {/* Pass everything to a client container */}
      <DevicesGrid brands={brands} brandMap={brandMap} />
    </>
  );
}

