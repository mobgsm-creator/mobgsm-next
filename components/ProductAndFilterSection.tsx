'use client'
import { getProducts, getBNPL, getESIM, getReloadlyAirtime, getReloadlyGifts, getDevices } from "../lib/supabase"
import { useState, useEffect } from "react"
import ProductListing from "./ProductListing"
import FilterSidebar from "./FilterSidebar"
import type { Product, ESIMProvider,BNPLProvider, reloadly } from "../lib/types"
import { Filter } from "lucide-react"
interface ProductListingProps {
    country: string
    
  }
type Device = {
    id: number;
    name: string;
    name_url: string;
    brand_name: string;
    image: string;
  };
  
export default function ProductSectionWrapper({ country } : ProductListingProps) {
  const [view, setView] = useState<'products' | 'esim' | 'bnpl' | 'reloadly-airtime' | 'reloadly-gifts'>('reloadly-airtime')
  const priorityCountries = ['AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AZ', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BM', 'BO', 'BR', 'BS', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ', 'GR', 'GT', 'GW', 'GY', 'HN', 'HT', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MD', 'MG', 'ML', 'MM', 'MN', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NZ', 'OM', 'PA', 'PE', 'PH', 'PK', 'PL', 'PR', 'PT', 'PY', 'QA', 'RO', 'RS', 'RU', 'RW', 'SA', 'SC', 'SD', 'SE', 'SG', 'SI', 'SK', 'SL', 'SN', 'SO', 'SR', 'SV', 'SZ', 'TC', 'TD', 'TG', 'TH', 'TJ', 'TL', 'TN', 'TR', 'TT', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VC', 'VE', 'VG', 'VN', 'WS', 'YE', 'ZA', 'ZM', 'ZW']
  const [isOpen, setIsOpen] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])
  const [product, setProduct] = useState<Product[]>([]);
  const [BNPLProvider, setBNPLProvider] = useState<BNPLProvider[]>([]);
  const [esimProviders, setEsimProviders] = useState<ESIMProvider[]>([]);
  const [r_airtime,setAirtime] = useState<reloadly[]>([])
  const [r_gifts,setGifts] = useState<reloadly[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const [products, bnpl, esim, airtime, giftcards, device_list] = await Promise.all([
          getProducts(country),
          getBNPL(),
          getESIM(),
          getReloadlyAirtime(),
          getReloadlyGifts(),
          getDevices()
        ]);
      
        setProduct(products);
        setBNPLProvider(bnpl);
        setEsimProviders(esim);
        setAirtime(airtime);
        setGifts(giftcards);
        setDevices(device_list);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    };

    fetchData();
  }, [country]);
  const productsFromDevices: Product[] = devices.map((device) => ({
    flag: device.id,
    product_name: device.name,
    brand_name: device.brand_name,
    product_links: device.name_url,
    price: "",
    mrp: "",
    discount: "",
    status: "",
    payment_options: "",
    rating: "",
    reviews: "",
    img_link: device.image,
    country: "",
    store_logo: ""
  }));
  let filteredProducts = product.filter((item) => {
    return priorityCountries.includes(country)
      ? item.country === country
      : true;
  });
  filteredProducts = [...filteredProducts,...productsFromDevices]
  const filteredESIM = (esimProviders ?? []).filter((item) => {
    return priorityCountries.includes(country)
      ? item.country === country
      : true;
  });
  
  const filteredBNPL = (BNPLProvider ?? []).filter((item) => {
    return priorityCountries.includes(country)
      ? item.country === country
      : true;
  });

  const fitleredAirtime = (r_airtime ?? []).filter((item) => {
    return priorityCountries.includes(country)
      ? item.code === country
      : true;
  });
  const fitleredGifts = (r_gifts ?? []).filter((item) => {
    return priorityCountries.includes(country)
      ? item.code === country
      : true;
  });
  //console.log(filteredBNPL)
  

 
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar — Mobile & Desktop */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:w-80 lg:block
        `}
      >
        <div className="h-full mt-4 overflow-y-auto p-4 pt-20 lg:pt-0">
          
            <FilterSidebar
              product={filteredProducts}
              esimProviders={filteredESIM}
              BNPLProvider={filteredBNPL}
              airtime={fitleredAirtime}
              gifts={fitleredGifts}
              view={view}
            />
       
        </div>
      </div>

      {/* Toggle Button — Mobile Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-[10vh] left-0 z-50 bg-black p-2 rounded-r-md border border-l-0 border-gray-200 shadow-md hover:bg-black transition-colors"
      >
        {isOpen ? (
          <Filter className="text-white w-4 h-4" />
        ) : (
          <Filter className="text-white w-4 h-4" />
        )}
      </button>
      <div className="flex-1 min-w-0">
    
      <ProductListing
        product={filteredProducts}
        esimProviders={filteredESIM}
        BNPLProvider={filteredBNPL}
        airtime={fitleredAirtime}
        gifts={fitleredGifts}
        view={view}
        setView={setView}
      />
   
  </div>
    </div>
  )
}
