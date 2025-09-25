import { notFound } from "next/navigation"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { settings as is } from "@/public/combined_settings"
import fs from 'fs';
import path from 'path';
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CountrySelector from "@/components/CountrySelector"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginButton from "@/components/LoginButton";
const devicesJSONPath = path.join(process.cwd(), 'public', 'devices.json');
const devicesData = JSON.parse(fs.readFileSync(devicesJSONPath, 'utf-8'));
const countryMap: Record<string, string> = {
  "korea-south": "Korea (South)",
  "Hong-Kong": "Hong Kong",
  "united-states": "United States",
  "united-kingdom": "United Kingdom",
  "czech-republic": "Czech Republic",
  "saudi-arabia": "Saudi Arabia",
  "south-africa": "South Africa",
  "new-zealand": "New Zealand",
  "dominican-republic": "Dominican Republic",
  "el-salvador": "El Salvador",
  "sierra-leone": "Sierra Leone",
  "Viet-Nam": "Viet Nam",
  // add more as needed
};
import { Suspense } from "react"
import  DynamicCountryLinks  from "@/components/countryDropdownDevicePage"
import DynamicBrandLinks from "@/components/brandsDropdownDevicePage"
import DynamicMoreLinks from "@/components/moreDropdownDevicePage"
import { Device } from "@/lib/types"
import WalletPopup from "@/components/Wallet";
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
    rawCountry: "united-states"
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

// export const dynamic = "force-static"
// export const dynamicParams = false
//export const dynamic = 'force-dynamic'
//
export const revalidate =184600 // 24 hours
//export const dynamicParams = true
const getBalance = async () => {
  const session = await getServerSession(authOptions);
  const res = await fetch(`https://mobgsm.com/api/get_balance?email=${session?.user?.email}`);
  const data = await res.json();

  const balances: { amount: number; currency: string }[] = [];

  const credits = data.credit || [];
  const debits = data.debit || [];

  // index debits by currency for quick lookup
  const debitMap: Record<string, number> = {};
  for (const d of debits) {
    debitMap[d.currency] = (debitMap[d.currency] || 0) + d.amount;
  }

  for (const c of credits) {
    const debitAmount = debitMap[c.currency] || 0;
    balances.push({
      currency: c.currency,
      amount: c.amount - debitAmount,
    });
  }

  return balances;
};



// Static metadata generation
export async function generateMetadata( props: { params: Promise<{ slug: string }> }) {
  type SettingsMap = Record<string, Setting>
  const settings = is as SettingsMap
  const { slug } = await props.params;
  const { pureSlug, rawCountry } = parseSlug(slug);
  const country = countryMap[rawCountry!] || rawCountry;
  //console.log(country)
  const entry = Object.entries(settings).find(
    ([, value]) => value.country.toLowerCase() === country?.toLowerCase()
  )
  //console.log(entry)
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
  

  const allDevices: Device[] = Object.values(devicesData) as Device[];
  const device = allDevices.find(d => d.name_url === pureSlug);
  //console.log(pureSlug, allDevices.length)
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
 
  const allDevices: Device[] = Object.values(devicesData) as Device[];
  const device = allDevices.find(d => d.name_url === pureSlug);
  
  if (!device) return notFound()

  const json = device.json ? JSON.parse(device.json) : {};
  const specs = json?.data || {}
  

  let img_specs : ImgSpecs = {};

if (device?.specs) {
  try {
    // Optionally clean up common invalid string patterns first
    const safeSpecs = device.specs.replace('" inches', 'inches');
    img_specs = JSON.parse(safeSpecs);
  } catch (e) {
    console.error(e)
    console.error('Invalid JSON in device.specs:', device.specs);
  }
}


    const moreFromBrand = allDevices
    .filter(d => d.brand_name === device.brand_name && d.id !== device.id)
    .map(d => ({
      name: d.name,
      name_url: d.name_url,
      image: d.image,
      main_price: d.main_price
    }));

  
   
    const uniqueBrands = [...new Set(allDevices.map(d => d.brand_name))];
  

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
  const balance= await getBalance()
  const session = await getServerSession(authOptions);
  const { slug } = await params
  const { pureSlug, rawCountry } = parseSlug(slug);
  const country = countryMap[rawCountry!] || rawCountry;
  //console.log("pureSlug",pureSlug)
  // Get static content (this is cached/pre-rendered)
  const staticContent = await StaticDeviceContent({ slug })
  const { device, specs, img_specs, moreFromBrand, uniqueBrands } = staticContent
  
  
  const entry = Object.entries(settings).find(
      ([, value]) => value.country.toLowerCase() === country?.toLowerCase()
    ) // Fallback to default entry if not found
    
  
  
  

  return (
    <>
    <div className="">
      <div className="min-h-screen  bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      <Link  href={`https://${entry?.[0] ? entry[0] + "." : ""}mobgsm.com`}>
        <Image
          src="/MOBGSM-svg-vector.svg"
          alt="MOBGSM Logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>
    </div>
    
          <div className="flex flex-row absolute top-7 right-4">
            {/* Balance Display */}
            {session?.user?.email ? (
    
        <WalletPopup balance={balance} session={session} />
      ) : <LoginButton />}
      <div className='mx-2 gap-4'>
            <CountrySelector country={entry![0]}  /></div>
          </div>
        </div>
      </header>
      <div className='mt-6 mx-0 sm:mx-12'>
        <Tabs className = 'flex sm:justify-center sm:ml-10'value="">
      <TabsList className="flex-wrap text-sm">
        <Link href="/#reloadly-airtime" passHref>
          <TabsTrigger value="reloadly-airtime" asChild>
            <button>Airtime Topup</button>
          </TabsTrigger>
        </Link>

        <Link href="/#reloadly-gifts" passHref>
          <TabsTrigger value="reloadly-gifts" asChild>
            <button>Giftcards</button>
          </TabsTrigger>
        </Link>

        <Link href="/#products" passHref>
          <TabsTrigger value="products" asChild>
            <button>
              Mobiles
              <sup className="text-[0.4rem] align-super">
                <span className="font-semibold text-white bg-purple-500 px-2 py-0.5 rounded">
                  BETA
                </span>
              </sup>
            </button>
          </TabsTrigger>
        </Link>

        <Link href="/#esim" passHref>
          <TabsTrigger value="esim" asChild>
            <button>
              eSIM Offers
              <sup className="text-[0.4rem] align-super">
                <span className="font-semibold text-white bg-purple-500 px-2 py-0.5 rounded">
                  BETA
                </span>
              </sup>
            </button>
          </TabsTrigger>
        </Link>

        <Link href="/#bnpl" passHref>
          <TabsTrigger value="bnpl" asChild>
            <button>
              BNPL Offers
              <sup className="text-[0.4rem] align-super">
                <span className="font-semibold text-white bg-purple-500 px-2 py-0.5 rounded">
                  BETA
                </span>
              </sup>
            </button>
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs></div>


        <div className="mt-8 sm:mt-0 mx-auto flex max-w-7xl flex-col md:flex-row">
          {/* Main Content */}
          <div className="flex-1 bg-gray-50 rounded-2xl">
            <div className="bg-white p-4 border-b rounded-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
  {`${device.name} ${country ? `Price in ${country}` : ''}`}
</h1>

              <div className="flex flex-row gap-4 bg-white p-4 rounded-2xl ">
                {/* Left: Image */}
                <div className="w-[150px] h-[150px] flex items-center justify-center bg-white ">
                  <Image
                    src={device.image || "/placeholder.svg"}
                    alt={device.name}
                    className="object-contain max-w-full max-h-full"
                    loading="lazy"
                    width={150} height={150}
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
                <div className="bg-white px-4 py-2 flex items-center justify-between cursor-pointer rounded-2xl">
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
          <div className="bg-white p-4 rounded-2xl">
            {/* Related Devices */}
            <DynamicMoreLinks country={entry![0]} more={moreFromBrand || []} brand={device.brand_name} />

            {/* Brands Section */}
            <DynamicBrandLinks country={entry![0]} uniqueBrands={uniqueBrands} />

            {/* Dynamic Countries Section */}
            <Suspense fallback={<div>Loading countries...</div>}>
              <DynamicCountryLinks deviceSlug={pureSlug} country={country} settings={settings} />
            </Suspense>
          </div>
        </div>
        <div className='bg-white'>
        <div className='text-[0.6rem] flex flex-col text-center bg-white'>
         <h3 className='mt-4 text-center'> 
          <strong>Disclaimer: </strong> </h3> <div><br></br> 
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
