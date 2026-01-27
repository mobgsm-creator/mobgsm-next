
import fs from 'fs';
import path from 'path';
import { Device } from "@/lib/types"
import DevicesGrid from "@/components/mobilePageGrid";
import { headers } from 'next/headers'
import HeaderClientWrapper from "@/components/headerClientWrapper";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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
  const session = await getServerSession(authOptions);
  // Default brand = first key


  return (
    <>
      <HeaderClientWrapper session={session!} country_value={country_domain || "us"}/>

      {/* Pass everything to a client container */}
      <DevicesGrid brands={brands} brandMap={brandMap} />
    </>
  );
}

