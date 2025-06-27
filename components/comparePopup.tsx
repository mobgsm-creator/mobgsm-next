// components/ComparePopup.tsx
import type { Product } from "../lib/types"

  type ComparePopupProps = {
    products: Product[]
    onClose: () => void
  }
  
  export default function ComparePopup({ products, onClose }: ComparePopupProps) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 w-[95%] max-w-7xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
  
          <h2 className="text-2xl font-semibold mb-6">Compare Products</h2>
  
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">MRP</th>
                  <th className="px-4 py-2 border">Rating</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Link</th>
                  <th className="px-4 py-2 border">Payment</th>
                  
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-4 py-2 border">{product.product_name}</td>
                    <td className="px-4 py-2 border">{product.price}</td>
                    <td className="px-4 py-2 border">{product.mrp}</td>
                    <td className="px-4 py-2 border">{product.rating}</td>
                    <td className="px-4 py-2 border">{product.status}</td>
                    <td className="px-4 py-2 border">
                      <a
                        href={product.product_links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Buy
                      </a>
                    </td>
                    <td className="px-4 py-2 border">{product.payment_options}</td>
               
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  