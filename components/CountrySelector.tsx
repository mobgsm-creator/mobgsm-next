"use client"

import * as Select from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { useEffect } from "react"

interface Props {
  country: string
  setCountry: (value: string) => void
}

const CountrySelector = ({ country, setCountry }: Props) => {
  const countries = [
 
    { code: "US", name: "USA", flag: "🇺🇸"},
    { code: "NL", name: "Netherlands", flag: "🇳🇱"},
    { code: "FR", name: "France", flag: "🇫🇷"},
    { code: "IL", name: "Israel", flag: "🇮🇱"},
    { code: "IT", name: "Italy", flag: "🇮🇹"},
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "AE", name: "UAE", flag: "🇦🇪"},
    { code: "NO", name: "Norway", flag: "🇳🇴"},
    { code: "DE", name: "Germany", flag: "🇩🇪"}
  ];
  
  

  useEffect(() => {
    localStorage.setItem("selectedCountry", country)
  }, [country])

  const selectedCountry = countries.find((c) => c.code === country)

  return (
    <Select.Root value={country} onValueChange={setCountry}>
      <Select.Trigger
        className="inline-flex items-center justify-between rounded-lg px-4 py-2 border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
        aria-label="Country"
      >
        <Select.Value>
          {selectedCountry && (
            <span className="flex items-center gap-2">
              <img
                    src={`https://flagcdn.com/w20/${selectedCountry.code.toLocaleLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="inline-block w-5 h-4 mr-2"
                  />
             
              <span>{selectedCountry.name}</span>
            </span>
          )}
        </Select.Value>
        <Select.Icon className="ml-2 text-gray-400">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="z-50 rounded-lg border border-gray-200 bg-white shadow-md"
          position="popper"
        >
          <Select.Viewport className="p-2">
            {countries.map((item) => (
              <Select.Item
                key={item.code}
                value={item.code}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm cursor-pointer focus:bg-blue-100 focus:outline-none"
              >
                <Select.ItemText>
                  <img
                    src={`https://flagcdn.com/w20/${item.code.toLowerCase()}.png`}
                    alt={item.name}
                    className="inline-block w-5 h-4 mr-2"
                  />
                  {item.name}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default CountrySelector
