import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { settings as is } from "@/public/combined_settings"
import { headers } from "next/headers"
import { Suspense } from "react"
import  DynamicCountryLinks  from "@/components/countryDropdownDevicePage"
export const runtime = 'edge';
//redeploy
function parseSlug(slugArray: string) {
  
  const fullSlug = slugArray[0] || ''
  
  // Check if it's in the format: something-price-in-country
  const match = fullSlug.match(/^(.*)-price-in-([a-z-]+)$/i)

  if (match) {
    const pureSlug = match[1]      // e.g., infinix-note-50-4g
    const country = match[2]       // e.g., angola
    return { pureSlug, country }
  }

  return {
    pureSlug: fullSlug,
    country: null
  }
}
// Types remain the same
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
interface ImgSpecs {
  display?: {
    size?: string;
    resolution?: string;
  };
  camera?: {
    main?: string;
    video?: string;
  };
  performance?: {
    ram?: string;
    chipset?: string;
  };
  battery?: {
    capacity?: string;
  };
}

type SettingsMap = Record<string, Setting>
const settings = is as SettingsMap

interface Params {
  params: Promise<{ slug: string }>
}

// // Pre-generate all device pages at build time
// export async function generateStaticParams() {
//   const supabase = createClient()

//   const { data: devices } = await supabase.from("devices").select("name_url") // Adjust based on your needs

//   if (!devices) return []

//   return devices.map((device) => ({
//     slug: device.name_url,
//   }))
// }


export const revalidate = 86400 // 24 hours
export const dynamicParams = true


// Static metadata generation
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { pureSlug, country } = parseSlug(slug);
  const supabase = createClient()

  const { data: device } = await supabase
    .from("devices")
    .select("name, description, keywords, image")
    .eq("name_url", pureSlug)
    .single()

  if (!device) {
    return {
      title: "Not Found | MobGsm",
      description: "This device does not exist.",
    }
  }

  return {
    title: `${device.name} ${country ? `Price in ${country} ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} & Specifications | MobGsm` : '| MobGsm'}`,
    description: device.description ? `View detailed full specifications, mobile price and reviews about ${device.name}.` : "",
    keywords: [...(device.keywords?.split(",") || [device.name?.split(" ")]), ...( `",mobile,price,specifications,specs,information,info,reviews"`.split(","))].join(","),
    openGraph: {
      title: `${device.name} ${country ? `Price in ${country} ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} & Specifications | MobGsm` : '| MobGsm'}`,
      description: device.description ? `View detailed full specifications, mobile price and reviews about ${device.name}.` : "",
      images: [device.image || "/opengraph-image.png"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${device.name} ${country ? `Price in ${country} ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} & Specifications | MobGsm` : '| MobGsm'}`,
      description: device.description ? `View detailed full specifications, mobile price and reviews about ${device.name}.` : "",
      images: [device.image || "/opengraph-image.png"],
      url: `https://mobgsm.com/listings/blog/${pureSlug}`,
    },
  }
}

// Static component for the main device content
async function StaticDeviceContent({ slug }: { slug: string }) {
  const { pureSlug, country } = parseSlug(slug);
  console.log("country:",country)
  const supabase = createClient()

  const { data: device, error } = await supabase.from("devices").select("*").eq("name_url", pureSlug).single()

  if (!device || error) return notFound()

  const json = device.json
  const specs = json?.data || {}
  const brandName = device.brand_name
  let img_specs : ImgSpecs = {};

if (device?.specs) {
  try {
    // Optionally clean up common invalid string patterns first
    const safeSpecs = device.specs.replace('" inches', 'inches');
    img_specs = JSON.parse(safeSpecs);
  } catch (e) {
    console.error('Invalid JSON in device.specs:', e);
  }
}


  const { data: moreFromBrand } = await supabase
    .from("devices")
    .select("name, name_url, image, main_price")
    .eq("brand_name", brandName)
    .neq("id", device.id)
    .limit(8)

  const { data: allBrands } = await supabase.from("devices").select("brand_name").neq("brand_name", "").limit(50)

  const uniqueBrands = [...new Set(allBrands?.map((b) => b.brand_name))].sort()

  return { device, specs, img_specs, moreFromBrand, uniqueBrands }
}

// Dynamic component for country-specific content
function DynamicCountryContent({ device, slugcountry }: { device: any, slugcountry:string|null }) {//eslint-disable-line
  const headersList = headers()
  const subdomain = headersList.get("x-subdomain") || "us"
  
  const country = slugcountry
  const entry = Object.entries(settings).find(
    ([, value]) => value.country.toLowerCase() === country?.toLowerCase()
  )
  const setting =  (entry ? settings[entry[0]] : undefined) 
  ?? settings[subdomain]
  ?? settings["us"]
  
  const currency = setting.currency
  const rate = Number.parseFloat(setting.exchangerates) || 1

  if (!device.main_price) return null

  return (
    <div className="mt-4 bg-white p-4 rounded-2xl shadow">
      <h3 className="text-md font-semibold mb-2">Price in {country}</h3>
      <p className="text-gray-900 text-lg">
        {currency} {(device.main_price * rate).toFixed(2)}
      </p>
    </div>
  )
}



export default async function BlogPage({ params }: Params) {
  const { slug } = await params
  const { pureSlug, country } = parseSlug(slug);
  //console.log("pureSlug",pureSlug)
  // Get static content (this is cached/pre-rendered)
  const staticContent = await StaticDeviceContent({ slug })
  const { device, specs, img_specs, moreFromBrand, uniqueBrands } = staticContent

  return (
    <div className="flex justify-center items-center">
      <div className="min-h-screen max-w-4xl bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
          <Image src="/listings/MOBGSM-svg-vector.svg" alt="" width={40} height={40} />
          
        </div>
      </header>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          {/* Main Content */}
          <div className="flex-1 bg-gray-100">
            <div className="bg-white p-4 border-b">
              <div className="flex flex-row gap-4 bg-white p-4 rounded-2xl shadow-2xl">
                {/* Left: Image */}
                <div className="w-[150px]">
                  <img
                    src={device.image || "/placeholder.svg"}
                    alt={device.name}
                    srcSet={`${device.image} 2x`}
                   
              
                  
                   
                  />
                </div>
                

                {/* Right: Specs Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                  <div className="flex items-center space-x-3 w-[150px]">
                    <span>📱</span>
                    <span>
                      <strong>{img_specs.display?.size}</strong>
                      <br />
                      {img_specs.display?.resolution}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 w-[150px]">
                    <span>📷</span>
                    <span>
                      <strong>{img_specs.camera?.main}</strong>
                      <br />
                      {img_specs.camera?.video}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 w-[150px]">
                    <span>💾</span>
                    <span>
                      <strong>{img_specs.performance?.ram}</strong>
                      <br />
                      {img_specs.performance?.chipset}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 w-[150px]">
                    <span>🔋</span>
                    <span>
                      <strong>{img_specs.battery?.capacity}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-lg font-bold uppercase mt-4">
                {device.name} FULL SPECIFICATIONS
                {/* Dynamic pricing component */}
                <Suspense fallback={<div>Loading price...</div>}>
                  <DynamicCountryContent device={device} slugcountry={country} />
                </Suspense>
              </h1>
            </div>

            {/* Launch Section */}
            <div className="bg-white mb-1">
              <div className="bg-gray-100 px-4 py-2 flex items-center justify-between cursor-pointer">
                <h2 className="font-bold text-black">LAUNCH</h2>
                <ChevronDown className="h-4 w-4 text-black" />
              </div>
              <div className="px-4">
                <div className="flex border-b border-gray-200">
                  <div className="w-32 py-3 text-gray-700 font-medium">Announced</div>
                  <div className="flex-1 py-3 text-gray-900">2025, March 04</div>
                </div>
                <div className="flex">
                  <div className="w-32 py-3 text-gray-700 font-medium">Status</div>
                  <div className="flex-1 py-3 text-gray-900">Available. Released 2025, March</div>
                </div>
              </div>
            </div>

            {/* Network Section */}
            <div className="bg-white mb-1">
              <div className="bg-gray-100 px-4 py-2 flex items-center justify-between cursor-pointer">
                <h2 className="font-bold text-black">NETWORK SUPPORT & CONNECTIVITY</h2>
                <ChevronDown className="h-4 w-4 text-black" />
              </div>
              <div className="px-4">
                <div className="flex">
                  <div className="w-32 py-3 text-gray-700 font-medium">Technology</div>
                  <div className="flex-1 py-3 text-gray-900">GSM / HSPA / LTE</div>
                </div>
              </div>
            </div>

            {/* Specifications Sections */}
            {Object.entries(specs).map(([category, details]) => (
              <div key={category} className="bg-white mb-1">
                <div className="bg-gray-100 px-4 py-2 flex items-center justify-between cursor-pointer">
                  <h2 className="font-bold text-black uppercase">{category.replace(/_/g, " & ")}</h2>
                  <ChevronDown className="h-4 w-4 text-black" />
                </div>
                <div className="px-4">
                  {Object.entries(details as Record<string, string>).map(([key, value], index, array) => (
                    <div key={key} className={`flex ${index < array.length - 1 ? "border-b border-gray-200" : ""}`}>
                      <div className="w-32 py-3 text-gray-700 font-medium capitalize">{key.replace(/_/g, " ")}</div>
                      <div className="flex-1 py-3 text-gray-900">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="bg-gray-200 p-4">
            {/* Related Devices */}
            <div className="bg-gray-300 px-4 py-2 flex items-center justify-between">
                <h3 className="font-bold text-black">Similar Devices</h3>
                <ChevronRight className="h-4 w-4 text-black" />
              </div>
            <div className="mb-6">
              {moreFromBrand?.slice(0, 7).map((item) => (
                <Link key={item.name_url} href={`/blog/${item.name_url}`}>
                  <div className="bg-white mb-1 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Brands Section */}
            <div className="bg-white">
              <div className="bg-gray-300 px-4 py-2 flex items-center justify-between">
                <h3 className="font-bold text-black">BRANDS</h3>
                <ChevronRight className="h-4 w-4 text-black" />
              </div>
              <div>
                {uniqueBrands.slice(0, 9).map((brand) => (
                  <div
                    key={brand}
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="text-gray-900 font-medium">{brand}</span>
                    <ChevronRight className="h-4 w-4 text-red-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Countries Section */}
            <Suspense fallback={<div>Loading countries...</div>}>
              <DynamicCountryLinks deviceSlug={pureSlug} country={country} settings={settings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
