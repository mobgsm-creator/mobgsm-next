import Image from "next/image"
import Link from "next/link"
import { Star, ExternalLink } from "lucide-react"
import type { Product } from "../lib/types"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useState } from "react";

type ProductCardProps = {
  product: Product[];
};

export default function ProductCard({ product }: ProductCardProps) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + product.length) % product.length);
  };

  const currentProduct = product[currentIndex];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={currentProduct.img_link}
          alt={currentProduct.product_name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {currentProduct.discount}
        </Badge>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/shopclues.svg?height=20&width=60"
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
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{currentProduct.rating}</span>
          </div>
          <span className="text-xs text-gray-500">•</span>
          <Badge variant="outline" className="text-xs">
            {currentProduct.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link
              href={currentProduct.product_links}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>

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
      </div>
    </div>
  );
}
