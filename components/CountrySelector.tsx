// CountrySelector.tsx
"use client"
import { useEffect } from "react"

interface Props {
  country: string
  setCountry: (value: string) => void
}

const CountrySelector = ({ country, setCountry }: Props) => {
  const countries = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "RU", name: "Russia", flag: "🇷🇺" },
    { code: "CN", name: "China", flag: "🇨🇳" },
  ]

  useEffect(() => {

    localStorage.setItem("selectedCountry", country)
  }, [country])

  const selectedCountry = countries.find((c) => c.code === country)

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[140px]"
        >
          {countries.map((countryItem) => (
            <option key={countryItem.code} value={countryItem.code}>
              {countryItem.flag} {countryItem.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-lg">{selectedCountry?.flag}</span>
        </div>
      </div>
    </div>
  )
}

export default CountrySelector

