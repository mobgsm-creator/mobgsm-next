import Link from "next/link";
import { cn } from "@/lib/utils"

type Country = { name: string; code: string }
type Region = { title: string; countries: Country[] }

const regions: Region[] = [
  {
    title: "ASIA",
    countries: [
      { name: "Afghanistan", code: "af" },
      { name: "Australia", code: "au" },
      { name: "Azerbaijan", code: "az" },
      { name: "Bangladesh", code: "bd" },
      { name: "China", code: "cn" },
      { name: "Hong Kong", code: "hk" },
      { name: "India", code: "in" },
      { name: "Indonesia", code: "id" },
      { name: "Japan", code: "jp" },
      { name: "Kazakhstan", code: "kz" },
      { name: "South Korea", code: "kr" },
      { name: "Malaysia", code: "my" },
      { name: "Nepal", code: "np" },
      { name: "New Zealand", code: "nz" },
      { name: "Pakistan", code: "pk" },
      { name: "Papua New Guinea", code: "pg" },
      { name: "Philippines", code: "ph" },
      { name: "Singapore", code: "sg" },
      { name: "Sri Lanka", code: "lk" },
      { name: "Taiwan", code: "tw" },
      { name: "Tajikistan", code: "tj" },
      { name: "Thailand", code: "th" },
      { name: "Uzbekistan", code: "uz" },
      { name: "Vietnam", code: "vn" },
    ],
  },
  {
    title: "EUROPE",
    countries: [
      { name: "Armenia", code: "am" },
      { name: "Austria", code: "at" },
      { name: "Belarus", code: "by" },
      { name: "Belgium", code: "be" },
      { name: "Bosnia and Herzegovina", code: "ba" },
      { name: "Czech Republic", code: "cz" },
      { name: "Denmark", code: "dk" },
      { name: "Finland", code: "fi" },
      { name: "France", code: "fr" },
      { name: "Germany", code: "de" },
      { name: "Greece", code: "gr" },
      { name: "Greenland", code: "gl" },
      { name: "Hungary", code: "hu" },
      { name: "Italy", code: "it" },
      { name: "Latvia", code: "lv" },
      { name: "Lithuania", code: "lt" },
      { name: "Malta", code: "mt" },
      { name: "Moldova", code: "md" },
      { name: "Netherlands", code: "nl" },
      { name: "North Macedonia", code: "mk" },
      { name: "Norway", code: "no" },
      { name: "Poland", code: "pl" },
      { name: "Portugal", code: "pt" },
      { name: "Romania", code: "ro" },
      { name: "Russia", code: "ru" },
      { name: "Slovakia", code: "sk" },
      { name: "Spain", code: "es" },
      { name: "Sweden", code: "se" },
      { name: "Switzerland", code: "ch" },
      { name: "Turkey", code: "tr" },
      { name: "Ukraine", code: "ua" },
      { name: "United Kingdom", code: "uk" },
    ],
  },
  {
    title: "NORTH AMERICA & CARIBBEAN",
    countries: [
      { name: "Canada", code: "ca" },
      { name: "Dominican Republic", code: "do" },
      { name: "Haiti", code: "ht" },
      { name: "Honduras", code: "hn" },
      { name: "Jamaica", code: "jm" },
      { name: "Mexico", code: "mx" },
      { name: "Montserrat", code: "ms" },
      { name: "Puerto Rico", code: "pr" },
      { name: "United States", code: "us" },
    ],
  },
  {
    title: "SOUTH AMERICA",
    countries: [
      { name: "Argentina", code: "ar" },
      { name: "Bolivia", code: "bo" },
      { name: "Brazil", code: "br" },
      { name: "Chile", code: "cl" },
      { name: "Colombia", code: "co" },
      { name: "Ecuador", code: "ec" },
      { name: "Peru", code: "pe" },
      { name: "Uruguay", code: "uy" },
      { name: "Venezuela", code: "ve" },
    ],
  },
  {
    title: "MIDDLE EAST",
    countries: [
      { name: "Bahrain", code: "bh" },
      { name: "Iran", code: "ir" },
      { name: "Iraq", code: "iq" },
      { name: "Israel", code: "il" },
      { name: "Jordan", code: "jo" },
      { name: "Kuwait", code: "kw" },
      { name: "Lebanon", code: "lb" },
      { name: "Oman", code: "om" },
      { name: "Qatar", code: "qa" },
      { name: "Saudi Arabia", code: "sa" },
      { name: "Syria", code: "sy" },
      { name: "United Arab Emirates", code: "ae" },
      { name: "Yemen", code: "ye" },
    ],
  },
  {
    title: "AFRICA",
    countries: [
      { name: "Algeria", code: "dz" },
      { name: "Angola", code: "ao" },
      { name: "Cameroon", code: "cm" },
      { name: "Egypt", code: "eg" },
      { name: "Ethiopia", code: "et" },
      { name: "Ghana", code: "gh" },
      { name: "Kenya", code: "ke" },
      { name: "Madagascar", code: "mg" },
      { name: "Malawi", code: "mw" },
      { name: "Mauritius", code: "mu" },
      { name: "Morocco", code: "ma" },
      { name: "Mozambique", code: "mz" },
      { name: "Namibia", code: "na" },
      { name: "Nigeria", code: "ng" },
      { name: "Rwanda", code: "rw" },
      { name: "Seychelles", code: "sc" },
      { name: "Sierra Leone", code: "sl" },
      { name: "Solomon Islands", code: "sb" },
      { name: "South Africa", code: "za" },
      { name: "Sudan", code: "sd" },
      { name: "Tanzania", code: "tz" },
      { name: "Tunisia", code: "tn" },
      { name: "Uganda", code: "ug" },
      { name: "Zambia", code: "zm" },
      { name: "Zimbabwe", code: "zw" },
    ],
  },
]

// Small helper to build the destination URL.
function buildCountryUrl(code: string) {
  return `https://${code}.mobgsm.com`
}

export function FooterCountryLinks({
  className,
}: {
  className?: string
}) {
  return (
    <footer className={cn("border-t bg-background", className)} aria-labelledby="country-links-title">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <h2 id="country-links-title" className="sr-only">
          Country links
        </h2>

        <div className="space-y-8">
          {regions.map((region) => (
            <section key={region.title} aria-labelledby={`region-${region.title}`}>
              <h3
                id={`region-${region.title}`}
                className="text-xs font-semibold tracking-wider text-muted-foreground mb-2"
              >
                {region.title}:
              </h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {region.countries.map((c) => (
                  <li key={`${region.title}-${c.code}`}>
                    <Link
                      href={buildCountryUrl(c.code)}
                      className="underline-offset-4 hover:underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    >
                      {c.name} |
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <figure className="hidden" aria-hidden="true">
          <img src="/images/country-footer-reference.png" alt="" />
        </figure>
      </div>
    </footer>
  )
}

export default FooterCountryLinks
