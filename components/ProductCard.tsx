import Image from "next/image"
import Link from "next/link"
import { Star, ExternalLink } from "lucide-react"
import type { Product } from "../lib/types"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  //const reviews = product.reviews ? product.reviews.split(",").map((r) => r.trim()) : []

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.img_link}
          alt={product.product_name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{product.discount}</Badge>
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

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{product.product_name}</h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-green-600">{product.price}</span>
          <span className="text-sm text-gray-500 line-through">{product.mrp}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">•</span>
          <Badge variant="outline" className="text-xs">
            {product.status}
          </Badge>
        </div>

        {/* {reviews.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {reviews.slice(0, 3).map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-gray-50 rounded-md px-3 py-1 text-xs text-gray-600 max-w-[200px]"
                >
                  {review}
                </div>
              ))}
            </div>
          </div>
        )} */}

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href={product.product_links} target="_blank" rel="noopener noreferrer">
              Buy Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          {product.payment_options && <p className="text-xs text-gray-500 text-center">{product.payment_options}</p>}
        </div>
      </div>
    </div>
  )
}
