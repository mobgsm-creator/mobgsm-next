import Image from "next/image"
import Link from "next/link"
import type { Product, ESIMProvider, BNPLProvider, reloadly } from "../lib/types"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useState } from "react";
import ComparePopup from "./comparePopup";
type ProductCardProps = {
  product: Product[] | ESIMProvider[] | BNPLProvider[] | reloadly[];
};

export default function ProductCard({ product }: ProductCardProps) {
  console.log(product.length)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompare, setShowCompare] = useState(false)
  
  

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
        <img
          src={currentProduct.img_link}
          alt={currentProduct.product_name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {currentProduct.discount ? 
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {currentProduct.discount}
        </Badge> : null}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={currentProduct.store_logo}
            alt="Store logo"
            width={60}
            height={20}
            className="h-5 w-auto"
          />
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {currentProduct.product_name}
        </h3>

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


        </div>

        <div className="space-y-2">
          <Button asChild className="w-1/3">
            <Link
              href={currentProduct.product_links}
              target="_blank"
              rel="noopener noreferrer"
              className='ml-6 flex items-center justify-center gap-2 text-white'
            >
              Buy Now
              
            </Link>
          </Button>
          <Button asChild onClick={handleCompare} className="w-1/3">
          
            
         
              <span className = 'ml-12'>Compare</span>
              
       
          </Button>
          {showCompare && (
        <ComparePopup
          products={product.filter(isProduct)}
          onClose={() => setShowCompare(false)}
        />
      )}

          {currentProduct.payment_options && (
            <p className="text-xs text-gray-500 text-center">
              {currentProduct.payment_options}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div></>)}
      {isBNPL(currentProduct)
              && (<>
              
              <div className="relative">
                <img
                  src={currentProduct.Image_URL}
                  alt={currentProduct.Name}
                  width={300}
                  height={200}
                  className="ml-20 w-1/2 object-contain"
                />
                <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">
                  BNPL
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {currentProduct.Name}
                </h3>

                <div className="space-y-1 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium text-gray-800">Credit Limit:</span>
            <span>{currentProduct.Credit_Limit}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-800  whitespace-nowrap">Interest Rate:</span>
            <span>{currentProduct.Interest_Rate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-800">KYC Required:</span>
            <span>{currentProduct.KYC ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-800">NBFC Partner:</span>
            <span>{currentProduct.NBFC_Partner}</span>
          </div>
        </div>


                <Button asChild className="w-full mt-4">
                  <Link
                    href={currentProduct.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex items-center justify-center gap-2 text-white'
                  >
                    Visit Website
                  </Link>
                </Button>
              </div>
              </>)}
              {isESIM(currentProduct) && (<>
              <div className="relative">
                <img
                  src={currentProduct.img_link}
                  alt={currentProduct.provider}
                  width={300}
                  height={200}
                  className="ml-20 w-1/2"
                />
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
          <div className="flex">
            <span className="font-medium text-gray-800 mr-1">Type:</span>
            <span>{currentProduct.type.join(", ")}</span>
          </div>

          {/* Plan List */}
          <div>

            <ul className="list-disc pl-5 mt-1 space-y-2">
              {currentProduct.plans.map((plan, index) => (
                <li key={index} className="text-gray-700 leading-snug">
                  <Link
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                    title={plan.name}
                  >
                    {plan.name}
                  </Link>
                  <span className="ml-1 text-gray-600">
                    – {plan.price || plan.price_range}
                    {plan.validity ? ` • ${plan.validity}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>


      
      </div>
      
      </>)

      }{isReloadly(currentProduct) && currentProduct.img_link.includes("s3.amazonaws") &&( <><div className="relative">
        { <img
          src={currentProduct.img_link}
          alt={currentProduct.operator}
          className="w-full"
        /> }
        {currentProduct.discount ? 
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {currentProduct.discount}
        </Badge> : null}
      </div>

      <div className="p-4">
        

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {currentProduct.operator}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className='flex flex-col'>
        <span className="text-md font-bold">Topup Amounts in Local Currency:</span>
        <span className="text-xs font-bold text-green-600">
  {
    currentProduct.sendable_values.includes('~') ? (
      currentProduct.sendable_values.split("~").map(value => (Number(value.trim()) * Number(currentProduct.fx)).toFixed(2)).join(" ~ ")
    ) : currentProduct.sendable_values.includes(',') ? (
      currentProduct.sendable_values
        .split(',')
        .map(value => (Number(value.trim()) * Number(currentProduct.fx)).toFixed(2))
        .join(', ')
    ) : (
      (Number(currentProduct.sendable_values) * Number(currentProduct.fx)).toFixed(2)
    )
  }
</span></div>

       
        </div>

        <div className="flex items-center gap-2 mb-3">
          
          <span className="text-xs text-gray-500">•</span>
          <Badge
  variant="outline"
  className="text-xs max-w-[12rem] overflow-hidden whitespace-nowrap p-0 relative"
>
  
</Badge>


        </div>

        

        {product.length > 1 && <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div>}
      </div></>)}
      {isReloadly(currentProduct) && currentProduct.img_link.includes("cdn.reloadly") &&( <><div className=" relative">
        { <img
          src={currentProduct.img_link}
          alt={currentProduct.operator}
          className="w-full h-48 object-contain"
        /> }
        {currentProduct.discount ? 
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {currentProduct.discount}
        </Badge> : null}
      </div>

      <div className="p-4">
        

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {currentProduct.operator}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className='flex flex-col'>
        <span className="text-md font-bold">Giftcard Amounts in Local Currency:</span>
        <span className="text-xs font-bold text-green-600">
  {
    currentProduct.sendable_values
  }
</span></div>

       
        </div>

        <div className="flex items-center gap-2 mb-3">
          
          <span className="text-xs text-gray-500">•</span>
          <Badge
  variant="outline"
  className="text-xs max-w-[12rem] overflow-hidden whitespace-nowrap p-0 relative"
>
  
</Badge>


        </div>

        

        {product.length > 1 && <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div>}
      </div></>)}
    
    </div>
    
  );
  
}
