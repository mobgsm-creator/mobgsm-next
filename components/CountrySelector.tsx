"use client"

import * as Select from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { useEffect } from "react"

interface Props {
  country: string
  setCountry: (value: string) => void
}

const CountrySelector = ({ country, setCountry }: Props) => {
  const countries = [{'code': 'AE', 'name': 'United Arab Emirates', 'flag': '🇦🇪'},
    {'code': 'AF', 'name': 'Afghanistan', 'flag': '🇦🇫'},
    {'code': 'AG', 'name': 'Antigua and Barbuda', 'flag': '🇦🇬'},
    {'code': 'AI', 'name': 'Anguilla', 'flag': '🇦🇮'},
    {'code': 'AL', 'name': 'Albania', 'flag': '🇦🇱'},
    {'code': 'AM', 'name': 'Armenia', 'flag': '🇦🇲'},
    {'code': 'AR', 'name': 'Argentina', 'flag': '🇦🇷'},
    {'code': 'AS', 'name': 'American Samoa', 'flag': '🇦🇸'},
    {'code': 'AT', 'name': 'Austria', 'flag': '🇦🇹'},
    {'code': 'AU', 'name': 'Australia', 'flag': '🇦🇺'},
    {'code': 'AW', 'name': 'Aruba', 'flag': '🇦🇼'},
    {'code': 'AZ', 'name': 'Azerbaijan', 'flag': '🇦🇿'},
    {'code': 'BB', 'name': 'Barbados', 'flag': '🇧🇧'},
    {'code': 'BD', 'name': 'Bangladesh', 'flag': '🇧🇩'},
    {'code': 'BE', 'name': 'Belgium', 'flag': '🇧🇪'},
    {'code': 'BF', 'name': 'Burkina Faso', 'flag': '🇧🇫'},
    {'code': 'BH', 'name': 'Bahrain', 'flag': '🇧🇭'},
    {'code': 'BI', 'name': 'Burundi', 'flag': '🇧🇮'},
    {'code': 'BJ', 'name': 'Benin', 'flag': '🇧🇯'},
    {'code': 'BM', 'name': 'Bermuda', 'flag': '🇧🇲'},
    {'code': 'BO', 'name': 'Plurinational State of Bolivia', 'flag': '🇧🇴'},
    {'code': 'BR', 'name': 'Brazil', 'flag': '🇧🇷'},
    {'code': 'BS', 'name': 'Bahamas', 'flag': '🇧🇸'},
    {'code': 'BW', 'name': 'Botswana', 'flag': '🇧🇼'},
    {'code': 'BZ', 'name': 'Belize', 'flag': '🇧🇿'},
    {'code': 'CA', 'name': 'Canada', 'flag': '🇨🇦'},
    {'code': 'CF', 'name': 'Central African Republic', 'flag': '🇨🇫'},
    {'code': 'CG', 'name': 'Congo', 'flag': '🇨🇬'},
    {'code': 'CH', 'name': 'Switzerland', 'flag': '🇨🇭'},
    {'code': 'CI', 'name': "Côte d'Ivoire", 'flag': '🇨🇮'},
    {'code': 'CL', 'name': 'Chile', 'flag': '🇨🇱'},
    {'code': 'CM', 'name': 'Cameroon', 'flag': '🇨🇲'},
    {'code': 'CN', 'name': 'China', 'flag': '🇨🇳'},
    {'code': 'CO', 'name': 'Colombia', 'flag': '🇨🇴'},
    {'code': 'CR', 'name': 'Costa Rica', 'flag': '🇨🇷'},
    {'code': 'CU', 'name': 'Cuba', 'flag': '🇨🇺'},
    {'code': 'CY', 'name': 'Cyprus', 'flag': '🇨🇾'},
    {'code': 'DE', 'name': 'Germany', 'flag': '🇩🇪'},
    {'code': 'DM', 'name': 'Dominica', 'flag': '🇩🇲'},
    {'code': 'DO', 'name': 'Dominican Republic', 'flag': '🇩🇴'},
    {'code': 'DZ', 'name': 'Algeria', 'flag': '🇩🇿'},
    {'code': 'EC', 'name': 'Ecuador', 'flag': '🇪🇨'},
    {'code': 'EG', 'name': 'Egypt', 'flag': '🇪🇬'},
    {'code': 'ES', 'name': 'Spain', 'flag': '🇪🇸'},
    {'code': 'ET', 'name': 'Ethiopia', 'flag': '🇪🇹'},
    {'code': 'FJ', 'name': 'Fiji', 'flag': '🇫🇯'},
    {'code': 'FR', 'name': 'France', 'flag': '🇫🇷'},
    {'code': 'GB', 'name': 'United Kingdom', 'flag': '🇬🇧'},
    {'code': 'GD', 'name': 'Grenada', 'flag': '🇬🇩'},
    {'code': 'GE', 'name': 'Georgia', 'flag': '🇬🇪'},
    {'code': 'GH', 'name': 'Ghana', 'flag': '🇬🇭'},
    {'code': 'GM', 'name': 'Gambia', 'flag': '🇬🇲'},
    {'code': 'GR', 'name': 'Greece', 'flag': '🇬🇷'},
    {'code': 'GT', 'name': 'Guatemala', 'flag': '🇬🇹'},
    {'code': 'GW', 'name': 'Guinea-Bissau', 'flag': '🇬🇼'},
    {'code': 'GY', 'name': 'Guyana', 'flag': '🇬🇾'},
    {'code': 'HN', 'name': 'Honduras', 'flag': '🇭🇳'},
    {'code': 'HT', 'name': 'Haiti', 'flag': '🇭🇹'},
    {'code': 'ID', 'name': 'Indonesia', 'flag': '🇮🇩'},
    {'code': 'IE', 'name': 'Ireland', 'flag': '🇮🇪'},
    {'code': 'IL', 'name': 'Israel', 'flag': '🇮🇱'},
    {'code': 'IN', 'name': 'India', 'flag': '🇮🇳'},
    {'code': 'IQ', 'name': 'Iraq', 'flag': '🇮🇶'},
    {'code': 'IT', 'name': 'Italy', 'flag': '🇮🇹'},
    {'code': 'JM', 'name': 'Jamaica', 'flag': '🇯🇲'},
    {'code': 'JO', 'name': 'Jordan', 'flag': '🇯🇴'},
    {'code': 'KE', 'name': 'Kenya', 'flag': '🇰🇪'},
    {'code': 'KG', 'name': 'Kyrgyzstan', 'flag': '🇰🇬'},
    {'code': 'KH', 'name': 'Cambodia', 'flag': '🇰🇭'},
    {'code': 'KM', 'name': 'Comoros', 'flag': '🇰🇲'},
    {'code': 'KN', 'name': 'Saint Kitts and Nevis', 'flag': '🇰🇳'},
    {'code': 'KR', 'name': 'Korea, Republic of', 'flag': '🇰🇷'},
    {'code': 'KW', 'name': 'Kuwait', 'flag': '🇰🇼'},
    {'code': 'KY', 'name': 'Cayman Islands', 'flag': '🇰🇾'},
    {'code': 'LA', 'name': "Lao People's Democratic Republic", 'flag': '🇱🇦'},
    {'code': 'LB', 'name': 'Lebanon', 'flag': '🇱🇧'},
    {'code': 'LK', 'name': 'Sri Lanka', 'flag': '🇱🇰'},
    {'code': 'LR', 'name': 'Liberia', 'flag': '🇱🇷'},
    {'code': 'MA', 'name': 'Morocco', 'flag': '🇲🇦'},
    {'code': 'MD', 'name': 'Moldova, Republic of', 'flag': '🇲🇩'},
    {'code': 'MG', 'name': 'Madagascar', 'flag': '🇲🇬'},
    {'code': 'ML', 'name': 'Mali', 'flag': '🇲🇱'},
    {'code': 'MM', 'name': 'Myanmar', 'flag': '🇲🇲'},
    {'code': 'MR', 'name': 'Mauritania', 'flag': '🇲🇷'},
    {'code': 'MS', 'name': 'Montserrat', 'flag': '🇲🇸'},
    {'code': 'MW', 'name': 'Malawi', 'flag': '🇲🇼'},
    {'code': 'MX', 'name': 'Mexico', 'flag': '🇲🇽'},
    {'code': 'MY', 'name': 'Malaysia', 'flag': '🇲🇾'},
    {'code': 'MZ', 'name': 'Mozambique', 'flag': '🇲🇿'},
    {'code': 'NE', 'name': 'Niger', 'flag': '🇳🇪'},
    {'code': 'NG', 'name': 'Nigeria', 'flag': '🇳🇬'},
    {'code': 'NI', 'name': 'Nicaragua', 'flag': '🇳🇮'},
    {'code': 'NL', 'name': 'Netherlands', 'flag': '🇳🇱'},
    {'code': 'NP', 'name': 'Nepal', 'flag': '🇳🇵'},
    {'code': 'OM', 'name': 'Oman', 'flag': '🇴🇲'},
    {'code': 'PA', 'name': 'Panama', 'flag': '🇵🇦'},
    {'code': 'PE', 'name': 'Peru', 'flag': '🇵🇪'},
    {'code': 'PH', 'name': 'Philippines', 'flag': '🇵🇭'},
    {'code': 'PK', 'name': 'Pakistan', 'flag': '🇵🇰'},
    {'code': 'PL', 'name': 'Poland', 'flag': '🇵🇱'},
    {'code': 'PR', 'name': 'Puerto Rico', 'flag': '🇵🇷'},
    {'code': 'PT', 'name': 'Portugal', 'flag': '🇵🇹'},
    {'code': 'PY', 'name': 'Paraguay', 'flag': '🇵🇾'},
    {'code': 'QA', 'name': 'Qatar', 'flag': '🇶🇦'},
    {'code': 'RO', 'name': 'Romania', 'flag': '🇷🇴'},
    {'code': 'RW', 'name': 'Rwanda', 'flag': '🇷🇼'},
    {'code': 'SA', 'name': 'Saudi Arabia', 'flag': '🇸🇦'},
    {'code': 'SG', 'name': 'Singapore', 'flag': '🇸🇬'},
    {'code': 'SL', 'name': 'Sierra Leone', 'flag': '🇸🇱'},
    {'code': 'SN', 'name': 'Senegal', 'flag': '🇸🇳'},
    {'code': 'SR', 'name': 'Suriname', 'flag': '🇸🇷'},
    {'code': 'SV', 'name': 'El Salvador', 'flag': '🇸🇻'},
    {'code': 'SZ', 'name': 'Eswatini', 'flag': '🇸🇿'},
    {'code': 'TC', 'name': 'Turks and Caicos Islands', 'flag': '🇹🇨'},
    {'code': 'TG', 'name': 'Togo', 'flag': '🇹🇬'},
    {'code': 'TH', 'name': 'Thailand', 'flag': '🇹🇭'},
    {'code': 'TJ', 'name': 'Tajikistan', 'flag': '🇹🇯'},
    {'code': 'TN', 'name': 'Tunisia', 'flag': '🇹🇳'},
    {'code': 'TT', 'name': 'Trinidad and Tobago', 'flag': '🇹🇹'},
    {'code': 'TZ', 'name': 'Tanzania, United Republic of', 'flag': '🇹🇿'},
    {'code': 'UG', 'name': 'Uganda', 'flag': '🇺🇬'},
    {'code': 'US', 'name': 'United States', 'flag': '🇺🇸'},
    {'code': 'UY', 'name': 'Uruguay', 'flag': '🇺🇾'},
    {'code': 'UZ', 'name': 'Uzbekistan', 'flag': '🇺🇿'},
    {'code': 'VC', 'name': 'Saint Vincent and the Grenadines', 'flag': '🇻🇨'},
    {'code': 'VE', 'name': 'Venezuela, Bolivarian Republic of', 'flag': '🇻🇪'},
    {'code': 'VG', 'name': 'Virgin Islands, British', 'flag': '🇻🇬'},
    {'code': 'VN', 'name': 'Viet Nam', 'flag': '🇻🇳'},
    {'code': 'WS', 'name': 'Samoa', 'flag': '🇼🇸'},
    {'code': 'YE', 'name': 'Yemen', 'flag': '🇾🇪'},
    {'code': 'ZA', 'name': 'South Africa', 'flag': '🇿🇦'},
    {'code': 'ZM', 'name': 'Zambia', 'flag': '🇿🇲'},
    {'code': 'ZW', 'name': 'Zimbabwe', 'flag': '🇿🇼'}];
  
  

  useEffect(() => {
    localStorage.setItem("selectedCountry", country)
  }, [country])

  const selectedCountry = countries.find((c) => c.code === country) || countries.find((c) => c.code === "US");


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
          <Select.Viewport className="p-2 max-h-60">
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
