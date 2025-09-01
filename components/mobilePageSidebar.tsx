"use client";

type SidebarProps = {
  brands: string[];
  selectedBrand: string | null;
  onBrandClick: (brand: string) => void;
};

export default function Sidebar({ brands, selectedBrand, onBrandClick }: SidebarProps) {
  return (
    <nav className="w-48 bg-white border-r shadow-sm p-4 sticky top-0 h-screen overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Brands</h2>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand}>
            <button
              onClick={() => onBrandClick(brand)}
              className={`block w-full text-left px-3 py-2 rounded ${
                selectedBrand === brand
                  ? "bg-gray-50 text-black font-bold"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              {brand}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
