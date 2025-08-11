import Image from "next/image"
import Link from "next/link"
import type { Product, ESIMProvider, BNPLProvider, reloadly } from "../lib/types"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useState } from "react";
import ComparePopup from "./comparePopup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
type ProductCardProps = {
  product: Product[] | ESIMProvider[] | BNPLProvider[] | reloadly[];
};

export default function ProductCard({ product }: ProductCardProps) {
  //console.log(product.length)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompare, setShowCompare] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [, setSelectedValue] = useState("")
  const [inputValue, setInputValue] = useState("")

  const handleReloadlySubmit = async () => {
    const response = await fetch("/api/reloadly_api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: inputValue, product: currentProduct })
    })
    const data = await response.json()
    console.log(data)
  }

  const renderValues = (product : reloadly) => {
    if (product.img_link.includes("s3.amazonaws")) {
      const values = product.sendable_values.includes("~")
        ? product.sendable_values.split("~")
        : product.sendable_values.includes(",")
        ? product.sendable_values.split(",")
        : [product.sendable_values]

      return (
        <>
          <DialogDescription className="text-sm font-semibold mb-2">Select Amount</DialogDescription>
          <div className="flex flex-wrap gap-2 mb-4">
            {values.length > 1 ? (values.map((val, i) => {
              const local = (Number(val.trim()) * Number(product.fx)).toFixed(2)
              return (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => {
                    setSelectedValue(local)
                    setInputValue(local)
                  }}
                >
                  {local}
                </Button>
              )
            })): ( <p>
              Enter a value between Min value: {values[0]} and Max value: {values[1]}
            </p>)
          }
          </div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter amount"
          />
        </>
      )
    } else if (product.img_link.includes("cdn.reloadly")) {
      const values = product.sendable_values.includes("~")
        ? product.sendable_values.split("~")
        : product.sendable_values.includes(",")
        ? product.sendable_values.split(",")
        : [product.sendable_values]
        console.log(product.operator, values)
      return (
        <>
          <DialogDescription className="text-sm font-semibold mb-2">Select Amount</DialogDescription>
          <div className="flex flex-wrap gap-2 mb-4">
            {values.length > 2 ? (values.map((val, i) => {
              const local = (Number(val.trim())).toFixed(2)
              return (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => {
                    setSelectedValue(local)
                    setInputValue(local)
                  }}
                >
                  {local}
                </Button>
              )
            })): values.length === 1 ?( <p>
              Value: {values[0]} 
            </p>) : ( <p>
              Enter a value between Min value: {values[0]} and Max value: {values[1]}
            </p>)
          }
          </div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter amount"
          />
        </>
      )
    }
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + product.length) % product.length);
  };

  const handleCompare = () => {
    setShowCompare(true)

  }

  const currentProduct = product[currentIndex];
  
  function isProduct(item: Product | ESIMProvider | BNPLProvider | reloadly): item is Product {
    const flag = "product_name" in item && typeof item.product_name === "string";
    //console.log("isProduct", flag, item);
    return flag;
  }
  
  function isESIM(item: Product | ESIMProvider | BNPLProvider | reloadly): item is ESIMProvider {
    const flag = "provider" in item && typeof item.provider === "string";
    //console.log("isESIM", flag, item);
    return flag;
  }
  
  function isBNPL(item: Product | ESIMProvider | BNPLProvider | reloadly): item is BNPLProvider {
    const flag = "Name" in item && typeof item.Name === "string";
    ///console.log("isBNPL", flag, item);
    return flag;
  }

  function isReloadly(item: Product | ESIMProvider | BNPLProvider | reloadly): item is reloadly {
    const flag = "operator" in item && typeof item.operator === "string";
   
    return flag;
  }
  
  

  return (
    
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {isProduct(currentProduct) && ( <><div className="relative">
        
        {currentProduct.product_links?.startsWith('https') ? (
  
  <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
  <img
    src={currentProduct.img_link}
    alt={currentProduct.product_name}
    className="h-20 w-20 object-contain p-1 drop-shadow-sm"
  />
</div>
  
) : (
  <Link href={`/blog/${currentProduct.product_links}`}>
  <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
  <img
    src={currentProduct.img_link}
    alt={currentProduct.product_name}
    className="h-20 w-20 object-contain p-1 drop-shadow-sm"
  />
</div></Link>
)}
        {currentProduct.discount ? 
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {currentProduct.discount}
        </Badge> : null}
      </div>
      
      <div className="p-4">
      {currentProduct.store_logo && (
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={currentProduct.store_logo}
            alt="Store logo"
            width={60}
            height={20}
            className="h-5 w-auto"
          />
        </div>)}

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {currentProduct.product_name}
        </h3>
        {currentProduct.mrp && (<>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-green-600">{currentProduct.price}</span>
          <span className="text-sm text-gray-500 line-through">{currentProduct.mrp}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          
          <span className="text-xs text-gray-500">•</span>
          <Badge
  variant="outline"
  className="text-xs max-w-[12rem] overflow-hidden whitespace-nowrap p-0 relative"
>
  <div
    style={{
      display: "inline-block",
      whiteSpace: "nowrap",
      animation: `scroll-continuous ${Math.max(5, currentProduct.status.length / 7)}s linear infinite`,
    }}
  >
    {currentProduct.status}
  </div>

  <style jsx>{`
    @keyframes scroll-continuous {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `}</style>
</Badge>


        </div></>)}
        <div className="flex flex-col items-center gap-2">
  <div className="flex justify-center gap-8">
    <Button asChild className="w-25 text-xs">
      <Link
        href={`/blog/${currentProduct.product_links}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Request Quote
      </Link>
    </Button>

    <Button onClick={handleCompare} className="w-25">
      <span className="text-xs text-center">Detail</span>
    </Button>
  </div>

  {currentProduct.payment_options && (
    <p className="text-xs text-gray-500 text-center">
      {currentProduct.payment_options}
    </p>
  )}

  {showCompare && (
    <ComparePopup
      products={product.filter(isProduct)}
      onClose={() => setShowCompare(false)}
    />
  )}
</div>

        {currentProduct.mrp && (<>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div></>)}
      </div></>)}
      {isBNPL(currentProduct)
              && (<>
              
              <div className="relative">
              <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={currentProduct.Image_URL}
                  alt={currentProduct.Name}
                  className="h-20 w-20 object-contain p-1 drop-shadow-sm"
                />
              </div>
                <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">
                  BNPL
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {currentProduct.Name}
                </h3>

                <div className="space-y-1 text-sm text-gray-700">
  {[
    { label: "Limit", value: currentProduct.Credit_Limit },
    { label: "Rate", value: currentProduct.Interest_Rate },
    { label: "KYC", value: currentProduct.KYC ? "Yes" : "No" },
    { label: "Partner", value: currentProduct.NBFC_Partner },
  ].map((item) => (
    <div key={item.label} className="grid grid-cols-3 gap-2">
      <span className="font-medium text-gray-800 col-span-1">{item.label}</span>
      <span className="col-span-2">{item.value}</span>
    </div>
  ))}
</div>



                <Button asChild className="w-full mt-4">
                  <Link
                    href={currentProduct.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex items-center justify-center gap-2 text-white text-xs '
                  >
                    Request Quote
                  </Link>
                </Button>
              </div>
              </>)}
              {isESIM(currentProduct) && (<>
                <div className="flex flex-col h-full border rounded-lg overflow-hidden">
              <div className="relative">
              <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={currentProduct.img_link}
                  alt={currentProduct.provider}
                  className="h-20 w-20 object-contain p-1 drop-shadow-sm"
                />
              </div>
                <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                  eSIM
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {currentProduct.provider}
                </h3>

                <div className="space-y-3 text-sm text-gray-700 mt-2">
          {/* Type Label */}
    
<div className="flex items-center flex-wrap gap-2 mt-2">
 
  {currentProduct.type.slice(0,3).map((t, idx) => (
    <span
      key={idx}
      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
    >
      {t}
    </span>
  ))}
</div>


          {/* Plan List */}
          <table className="w-full border-collapse mt-2">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-2 text-left">Plan</th>
      <th className="p-2 text-left">Price</th>
      <th className="p-2 text-left">Validity</th>
    </tr>
  </thead>
  <tbody>
    {currentProduct.plans.slice(0,3).map((plan, index) => (
      <tr key={index} className="border-b">
        <td className="p-2">
          <Link
            href={plan.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {plan.name}
          </Link>
        </td>
        <td className="p-2">{plan.price || plan.price_range}</td>
        <td className="p-2">{plan.validity || "—"}</td>
      </tr>
    ))}
  </tbody>
</table>


        </div>


      
      </div>
     
  
      <div className="mt-auto flex justify-center pt-4">
      <Button className="mb-8 w-25">
        <span className="text-xs">Request Quote</span>
      </Button>
    </div>
</div>
      
      </>)

      }{isReloadly(currentProduct) && (
        <>
          <div
  className="relative cursor-pointer p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-sm hover:shadow-lg transition-transform transform hover:scale-105"
  onClick={() => setIsOpen(true)}
>
  {/* Product Type Tag */}
  <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
    {currentProduct.code} {/* e.g., "Data PIN", "eSIM" */}
  </span>

  {/* Discount Badge */}
  {currentProduct.discount && (
    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white">
      {currentProduct.discount}
    </Badge>
  )}

 

  {/* Logo */}
  <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2">
    <img
      src={currentProduct.img_link}
      alt={currentProduct.operator}
      className="h-20 w-20 object-contain p-1 drop-shadow-sm"
    />
  </div>

  {/* Brand/Operator Name */}
  <p className="mt-3 text-center text-sm font-semibold text-gray-800 truncate">
    {currentProduct.operator}
  </p>

  {/* Min/Max Values */}
  {currentProduct.sendable_values && (
    <p className="text-xs text-gray-500 text-center">
      {currentProduct.sendable_values.includes("~")
        ? `Min: ${currentProduct.sendable_values.split("~")[0]} / Max: ${currentProduct.sendable_values.split("~")[1]}`
        : currentProduct.sendable_values.includes(",") ? `Min: ${currentProduct.sendable_values.split(",")[0]} / Max: ${currentProduct.sendable_values.split(",").slice(-1)[0]}` : `Value: ${currentProduct.sendable_values}`}
    </p>
  )}

<div className="flex justify-center gap-3 mt-2">
  <Button onClick={() => setIsOpen(true)} className="text-xs  w-25">
    Buy Now
  </Button>
  <Button className="w-25">
    <span className="text-xs">Request Quote</span>
  </Button>
</div>


  
</div>


          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentProduct.operator}</DialogTitle>
              </DialogHeader>

              {renderValues(currentProduct)}

              <DialogFooter>
                {currentProduct.img_link.includes("s3.amazonaws") && (
                  <Button onClick={handleReloadlySubmit}>Submit</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    
    </div>
    
  );
  
}
