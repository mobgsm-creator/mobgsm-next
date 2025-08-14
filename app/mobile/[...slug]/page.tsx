import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ChevronDown } from "lucide-react"

import Image from "next/image"
import { settings as is } from "@/public/combined_settings"

import { Suspense } from "react"
import  DynamicCountryLinks  from "@/components/countryDropdownDevicePage"
import DynamicBrandLinks from "@/components/brandsDropdownDevicePage"
import DynamicMoreLinks from "@/components/moreDropdownDevicePage"
//export const runtime = 'edge';
//redeploy

function parseSlug(slugArray: string) {
  
  const fullSlug = slugArray[0] || ''
  
  // Check if it's in the format: something-price-in-country
  const match = fullSlug.match(/^(.*)-price-in-([a-z-]+)$/i)

  if (match) {
    const pureSlug = match[1]      // e.g., infinix-note-50-4g
    const rawCountry = match[2]       // e.g., angola
    return { pureSlug, rawCountry }
  }

  return {
    pureSlug: fullSlug,
    rawCountry: null
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

// Pre-generate all device pages at build time
// export async function generateStaticParams() {
//   const supabase = createClient()

//   const { data: devices } = await supabase.from("devices").select("name_url") // Adjust based on your needs

//   if (!devices) return []

//   return devices.map((device) => ({
//     slug: [device.name_url],
//   }))
// }

export const dynamic = 'force-dynamic'

export const revalidate =184600 // 24 hours
//export const dynamicParams = true


// Static metadata generation
export async function generateMetadata( props: { params: Promise<{ slug: string }> }) {
  type SettingsMap = Record<string, Setting>
  const settings = is as SettingsMap
  const { slug } = await props.params;
  const { pureSlug, rawCountry } = parseSlug(slug);
  const country = rawCountry === "korea-south" ? "Korea (South)" : rawCountry;

  const entry = Object.entries(settings).find(
    ([, value]) => value.country.toLowerCase() === country?.toLowerCase()
  )
  let canonical: string;
  let alternatesLanguages: Record<string, string> = {};

  if (entry) {
    // Match found → single canonical
    const [key] = entry;
    canonical = `https://${key}.mobgsm.com/mobile/${pureSlug}-price-in-${rawCountry}`;
  } else {
    // No match → fallback to a default canonical
    canonical = `https://mobgsm.com/mobile/${pureSlug}`;

    // And add alternates for all countries
    alternatesLanguages = Object.fromEntries(
      Object.keys(settings).map(key => [
        key,
        `https://${key}.mobgsm.com/mobile/${pureSlug}-price-in-${settings[key].country.toLowerCase()}`
      ])
    );
  }
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
    title: `${device.name} ${country ? `Price in ${country}  & Specifications | MobGsm` : '| MobGsm'}`,
    description: device.description ? device.description : `View detailed full specifications, mobile price and reviews about ${device.name}.`,
    keywords: [...(device.keywords?.split(",") || [device.name?.split(" ")]), ...( `mobile,price,specifications,specs,information,info,reviews"`.split(","))].join(","),
    alternates: {
      canonical,
      languages: alternatesLanguages,
    
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        maxSnippet: -1,
        maxImagePreview: "large",
        maxVideoPreview: -1,
      }
    },
    openGraph: {
      title: `${device.name} ${country ? `Price in ${country} & Specifications | MobGsm` : '| MobGsm'}`,
      description: device.description ? `View detailed full specifications, mobile price and reviews about ${device.name}.` : "",
      images: [device.image || "/opengraph-image.png"],
      type: "article",
      sitename: "MobGsm",
    },
    twitter: {
      card: "summary_large_image",
      site: "@mobgsm",
      title: `${device.name} ${country ? `Price in ${country} & Specifications | MobGsm` : '| MobGsm'}`,
      description: device.description ? device.description : `View detailed full specifications, mobile price and reviews about ${device.name}.`,
      images: [device.image || "/opengraph-image.png"],
      url: `https://mobgsm.com/mobile/${pureSlug}`,
    },
  }
}

// Static component for the main device content
async function StaticDeviceContent({ slug }: { slug: string }) {
  const { pureSlug,  } = parseSlug(slug);
 
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
  
   
    const { data } = await supabase
  .from("devices")
  .select("brand_name");

  const uniqueBrands = [...new Set(data?.map(item => item.brand_name))];
  

  return { device, specs, img_specs, moreFromBrand, uniqueBrands }
}

// Dynamic component for country-specific content
function DynamicCountryContent({ device, slugcountry}: { device: any, slugcountry:string|null }) {//eslint-disable-line
  
  
  const country = slugcountry
  const entry = Object.entries(settings).find(
    ([, value]) => value.country.toLowerCase() === country?.toLowerCase()
  )
  const setting =  (entry ? settings[entry[0]] : undefined) 
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
  const { pureSlug, rawCountry } = parseSlug(slug);
  const country = rawCountry === "korea-south" ? "Korea (South)" : rawCountry;
  //console.log("pureSlug",pureSlug)
  // Get static content (this is cached/pre-rendered)
  const staticContent = await StaticDeviceContent({ slug })
  const { device, specs, img_specs, moreFromBrand, uniqueBrands } = staticContent

  return (
    <>
    <div className="flex justify-center max-w-7xl items-center">
      <div className="min-h-screen  bg-white">
        <header className="bg-white shadow-sm border-b">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
          <Image src="/MOBGSM-svg-vector.svg" alt="" width={40} height={40} />
          
        </div>
        </header>

        <div className=" mx-auto flex max-w-7xl flex-col md:flex-row">
          {/* Main Content */}
          <div className="flex-1 bg-gray-50 rounded-2xl">
            <div className="bg-white p-4 border-b rounded-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
  {`${device.name} ${country ? `Price in ${country}` : ''}`}
</h1>

              <div className="flex flex-row gap-4 bg-white p-4 rounded-2xl ">
                {/* Left: Image */}
                <div className="w-[150px] h-[150px] flex items-center justify-center bg-white ">
                  <img
                    src={device.image || "/placeholder.svg"}
                    alt={device.name}
                    className="object-contain max-w-full max-h-full"
                    loading="lazy"
                  />
                </div>


                

                {/* Right: Specs Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 rounded-2xl">
                  <div className="flex items-center space-x-3 w-[150px] rounded-2xl">
                    <span>📱</span>
                    <span>
                      <strong>{img_specs.display?.size}</strong>
                      <br />
                      {img_specs.display?.resolution}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 w-[150px] rounded-2xl">
                    <span>📷</span>
                    <span>
                      <strong>{img_specs.camera?.main}</strong>
                      <br />
                      {img_specs.camera?.video}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 w-[150px] rounded-2xl">
                    <span>💾</span>
                    <span>
                      <strong>{img_specs.performance?.ram}</strong>
                      <br />
                      {img_specs.performance?.chipset}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 w-[150px] rounded-2xl">
                    <span>🔋</span>
                    <span>
                      <strong>{img_specs.battery?.capacity}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-md font-bold uppercase mt-4 ">
                {device.name} FULL SPECIFICATIONS
                {/* Dynamic pricing component */}
                <Suspense fallback={<div>Loading price...</div>}>
                  <DynamicCountryContent device={device} slugcountry={country} />
                </Suspense>
              </h2>
            </div>

            
            {/* Specifications Sections */}
            {Object.entries(specs).map(([category, details]) => (
              <div key={category} className="bg-white mb-1 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer rounded-2xl">
                  <div className="text-md font-bold text-black uppercase">{category.replace(/_/g, " & ")}</div>
                  <ChevronDown className="h-4 w-4 text-black" />
                </div>
                <div className="px-4">
                  {Object.entries(details as Record<string, string>).map(([key, value], index, array) => (
                    <div key={key} className={`flex ${index < array.length - 1 ? "border-b border-gray-200" : ""}`}>
                      <div className="text-sm w-32 py-3 text-gray-700 font-medium capitalize">{key.replace(/_/g, " ")}</div>
                      <div className="text-sm w-64 py-3 text-gray-900 text-wrap">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="bg-gray-50 p-4 rounded-2xl">
            {/* Related Devices */}
            <DynamicMoreLinks more={moreFromBrand || []} brand={device.brand_name} />

            {/* Brands Section */}
            <DynamicBrandLinks uniqueBrands={uniqueBrands} />

            {/* Dynamic Countries Section */}
            <Suspense fallback={<div>Loading countries...</div>}>
              <DynamicCountryLinks deviceSlug={pureSlug} country={country} settings={settings} />
            </Suspense>
          </div>
        </div>
        <div className='bg-white'>
        <div className='text-[0.6rem] ml-4 flex flex-col max-w-4xl justify-center items-center bg-white'>
         <h3 className='mt-4 text-center'> 
          <strong>Disclaimer: </strong> </h3> <div>
          We do not guarantee that the information on this page is 100% accurate and up to date.  
        <br></br> <br></br> 
          The pricing published on this page is meant for general information purposes only. While we monitor prices regularly, the ones listed above might be outdated. We also cannot guarantee these are the lowest prices available, so shopping around is always a good idea.
        </div>

     
     <div>
     <footer className="bg-white border-t mt-8">
       <div className=" mx-auto px-4 py-6 text-center text-gray-600">
         © MobGsm 2025. All rights reserved.
       </div>
     </footer>
    </div></div>
        </div>  
     
    </div></div>
     
   </>

    
  )
}
