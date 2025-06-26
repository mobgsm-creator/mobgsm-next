"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, CreditCard, Smartphone, Clock, Users, DollarSign, Wifi } from "lucide-react"

const bnplData = [
  {
    name: "LazyPay",
    website: "https://lazypay.in",
    partner_merchants: ["Zomato", "BigBasket", "Samsung", "BookMyShow", "GoAir"],
    credit_limit: "Up to ₹100,000",
    interest_rate: "0% for 15 days",
    late_fee: "Varies; ₹10/day after due date",
    KYC_required: true,
    NBFC_partner: "PayU Finance (Naspers subsidiary)",
  },
  {
    name: "Amazon Pay Later",
    website: "https://www.amazon.in/paylater",
    partner_merchants: ["Amazon.in"],
    credit_limit: "Up to ₹60,000 (KYC users higher)",
    interest_rate: "0% for next month (or 1.18% EMI fee)",
    late_fee: "As per lender's schedule after 5th of month",
    KYC_required: true,
    NBFC_partner: "Capital Float / IDFC First Bank",
  },
  {
    name: "Paytm Postpaid",
    website: "https://paytm.com/postpaid",
    partner_merchants: ["Any UPI merchant", "billers", "fuel stations", "Paytm Mall"],
    credit_limit: "Up to ₹60,000",
    interest_rate: "0% for 30 days (billing cycle)",
    late_fee: "₹10–₹500/month depending on outstanding",
    KYC_required: true,
    NBFC_partner: "Paytm Payments Bank",
  },
  {
    name: "ZestMoney",
    website: "https://www.zestmoney.in",
    partner_merchants: ["Online electronics & travel merchants"],
    credit_limit: "Varies per user",
    interest_rate: "0% EMI sometimes; APR varies up to ~36%",
    late_fee: "As per EMI terms after due date",
    KYC_required: true,
    NBFC_partner: "Various NBFCs, acquired by DMI Group",
  },
  {
    name: "ePayLater",
    website: "https://www.epaylater.com",
    partner_merchants: ["Paytm Mall", "Digit Insurance", "others"],
    credit_limit: "Varies per user (usually ₹10k–₹50k)",
    interest_rate: "0% within due date",
    late_fee: "Applicable after due date (as per terms)",
    KYC_required: true,
    NBFC_partner: "IDFC First Bank",
  },
  {
    name: "Flipkart Pay Later",
    website: "https://www.flipkart.com/paylater",
    partner_merchants: ["Flipkart", "Myntra"],
    credit_limit: "Up to ₹100,000",
    interest_rate: "0% for 30 days (convert to EMI option)",
    late_fee: "Fee after 5th of month unpaid",
    KYC_required: true,
    NBFC_partner: "SBI Card / Axis Bank",
  },
  {
    name: "Simpl",
    website: "https://getsimpl.com",
    partner_merchants: ["Myntra", "BigBasket", "Zepto", "Zomato"],
    credit_limit: "Up to ₹25,000",
    interest_rate: "0% for 15 days (Pay-in-3 interest free over 90 days)",
    late_fee: "₹250 after due date",
    KYC_required: true,
    NBFC_partner: "Freo / IDFC First Bank",
  },
  {
    name: "MobiKwik Zip",
    website: "https://www.mobikwik.com/zip",
    partner_merchants: ["1 lakh+ online brands"],
    credit_limit: "Up to ₹60,000; personal loans ₹500k",
    interest_rate: "0% short period; EMI as per personal loan",
    late_fee: "As per terms after due date",
    KYC_required: true,
    NBFC_partner: "MobiKwik partner NBFCs",
  },
  {
    name: "Slice",
    website: "https://sliceit.com",
    partner_merchants: ["Select online/offline merchants"],
    credit_limit: "Up to ₹300,000/year",
    interest_rate: "Interest on EMI conversions; swipe credit at no interest if paid in time",
    late_fee: "As per payment delay",
    KYC_required: true,
    NBFC_partner: "Slice partner NBFCs",
  },
  {
    name: "Freecharge Pay Later",
    website: "https://www.freecharge.in",
    partner_merchants: ["Freecharge wallet merchants"],
    credit_limit: "₹10,000/month",
    interest_rate: "0% for 30 days",
    late_fee: "₹10/day late fee",
    KYC_required: true,
    NBFC_partner: "Axis Bank",
  },
  {
    name: "Axio",
    website: "https://www.axio.in",
    partner_merchants: ["Online brands & fintechs"],
    credit_limit: "Varies per user",
    interest_rate: "0% for short period; interest on EMI plans",
    late_fee: "As per policy",
    KYC_required: true,
    NBFC_partner: "IDFC First Bank",
  },
  {
    name: "PostPe",
    website: "https://www.postpe.com",
    partner_merchants: ["Flipkart", "AJIO", "Amazon", "Zomato", "others"],
    credit_limit: "Varies per user (₹5k–₹50k typical)",
    interest_rate: "0% for 15 days; EMI options available",
    late_fee: "As per delay charge",
    KYC_required: true,
    NBFC_partner: "Bank of Baroda",
  },
]

const esimData = [
  {
    provider: "Jio",
    type: ["eSIM", "Prepaid", "Postpaid"],
    plans: [
      {
        name: "Amazon Prime Prepaid",
        price: "₹1029",
        data: "2 GB/day",
        validity: "84 days",
        voice: "Unlimited",
        sms: "100/day",
        link: "https://www.jio.com/selfcare/plans/mobility/prepaid-plans-list/?category=Popular+Plans"
      },
      {
        name: "Standard eSIM Activation",
        price: "Free (swap)",
        details: "Activate eSIM via SMS 🔁 ≈10 min",
        type: "eSIM activation",
        link: "https://www.jio.com/jcms/esim/"
      },
      {
        name: "Postpaid Plus/Unlimited",
        price: "from ₹449/month",
        data: "50 GB+ (5G)",
        voice: "Unlimited",
        benefits: ["OTT apps", "Data rollover", "Family add-ons"],
        link: "https://www.jio.com/selfcare/plans/mobility/postpaid-plans-home/"
      },
    ],
  },
  {
    provider: "Airtel",
    type: ["eSIM", "Prepaid", "Postpaid"],
    plans: [
      {
        name: "Airtel Prepaid Recharges",
        price_range: "₹10–₹6999",
        data: "Varies",
        voice: "Varies",
        link: "https://www.airtel.in/offers/prepaid"
      },
      {
        name: "eSIM Activation",
        price: "Free",
        details: "Order & activate via Airtel Thanks app",
        link: "https://www.airtel.in/esim"
      },
      {
        name: "Postpaid Plan ₹449",
        price: "₹449/month",
        data: "50 GB + 5G",
        voice: "Unlimited",
        sms: "Included",
        benefits: ["OTT packs"],
        link: "https://www.airtel.in/plans/postpaid/"
      },
    ],
  },
  {
    provider: "Vi",
    type: ["eSIM", "Prepaid", "Postpaid"],
    plans: [
      {
        name: "Amazon Prime Prepaid ₹996",
        price: "₹996",
        data: "2 GB/day",
        validity: "84 days",
        voice: "Unlimited",
        sms: "100/day",
        link: "https://www.myvi.in/amazon-prime-recharge-plans"
      },
      {
        name: "Amazon Prime Prepaid ₹3799",
        price: "₹3799",
        data: "2 GB/day",
        validity: "365 days",
        voice: "Unlimited",
        sms: "100/day",
        link: "https://www.myvi.in/amazon-prime-recharge-plans"
      },
      {
        name: "Vi Max ₹451",
        price: "₹451/month",
        data: "50 GB + 50 GB bonus",
        voice: "Unlimited",
        sms: "3000/month",
        benefits: ["Choose 1 benefit (OTT/discount)"],
        link: "https://www.myvi.in/prepaid/vi-2gb-per-day-plans"
      },
      {
        name: "Vi Max ₹751",
        price: "₹751/month",
        data: "150 GB",
        voice: "Unlimited",
        sms: "3000/month",
        benefits: ["Choose 3 benefits"],
        link: "https://www.myvi.in/prepaid/vi-2gb-per-day-plans"
      },
      {
        name: "Vi REDX ₹1201",
        price: "₹1201/month",
        data: "Unlimited",
        voice: "Unlimited",
        sms: "3000/month",
        benefits: ["OTT", "Airport lounge", "Roaming"],
        link: "https://www.myvi.in/prepaid/vi-2gb-per-day-plans"
      },
    ],
  },
  {
    provider: "Airalo",
    type: ["International eSIM (data-only)"],
    plans: [
      {
        name: "Local India eSIM",
        price_range: "$4.50–$40",
        data: "1–20 GB",
        validity: "7–30 days",
        features: ["Hotspot enabled"],
        link: "https://www.airalo.com/india-esim"
      },
    ],
  },
  {
    provider: "Saily",
    type: ["International eSIM (data-only)"],
    plans: [
      {
        name: "India 1 GB/7‑day plan",
        price: "$3.99",
        data: "1 GB",
        validity: "7 days",
        link: "https://saily.com/esim-india/"
      },
      {
        name: "India 3 GB/30‑day plan",
        price: "$9.99",
        data: "3 GB",
        validity: "30 days",
        link: "https://saily.com/esim-india/"
      },
      {
        name: "India 20 GB/30‑day plan",
        price: "$38.99",
        data: "20 GB",
        validity: "30 days",
        link: "https://saily.com/esim-india/"
      },
    ],
  },
  {
    provider: "Jetpac",
    type: ["International eSIM (data-only)"],
    plans: [
      {
        name: "1 GB/4 days",
        price: "$1.00",
        data: "1 GB",
        validity: "4 days",
        link: "https://www.jetpacglobal.com/product-details/india-esim/"
      },
      {
        name: "3 GB/30 days",
        price: "$7.00",
        data: "3 GB",
        validity: "30 days",
        link: "https://www.jetpacglobal.com/product-details/india-esim/"
      },
      {
        name: "40 GB/30 days",
        price: "$55",
        data: "40 GB",
        validity: "30 days",
        link: "https://www.jetpacglobal.com/product-details/india-esim/"
      },
    ],
  },
  {
    provider: "aloSIM",
    type: ["International eSIM (voice & SMS)"],
    plans: [
      {
        name: "1 GB/7 days",
        price: "$4.50",
        data: "1 GB",
        validity: "7 days",
        link: "https://alosim.com/india-esim/"
      },
      {
        name: "Unlimited/10 days",
        price: "$35",
        data: "Unlimited",
        validity: "10 days",
        link: "https://alosim.com/india-esim/"
      },
    ],
    features: ["Hotspot", "Local number", "Voice/SMS via Hushed"],
  },
  {
    provider: "Nomad",
    type: ["International eSIM (data-only)"],
    plans: [
      {
        name: "1 GB/7 days",
        price: "$4.50",
        data: "1 GB",
        validity: "7 days",
        link: "https://www.airalo.com/india-esim" // Nomad individual clean link not found; pointing to similar
      },
      {
        name: "20 GB/30 days",
        price: "$39",
        data: "20 GB",
        validity: "30 days",
        link: "https://www.airalo.com/india-esim"
      },
    ],
  },
  {
    provider: "Holafly",
    type: ["International eSIM (data-only)"],
    plans: [
      {
        name: "Unlimited data",
        price: "varies ($)",
        validity: "varies",
        features: ["Unlimited", "Easy activation"],
        link: "https://www.airalo.com/india-esim" // placeholder
      },
    ],
  },
];


export default function BNPLESIMSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldAutoExpand, setShouldAutoExpand] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const shouldExpand = scrollPosition > 200
      setShouldAutoExpand(shouldExpand)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const BNPLCard = ({ provider }: { provider: (typeof bnplData)[0] }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{provider.name}</CardTitle>
          <Button variant="outline" size="sm" asChild className="bg-white text-black">
            <a href={provider.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        <CardDescription className="text-sm text-muted-foreground">{provider.NBFC_partner}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{provider.credit_limit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-muted-foreground">{provider.interest_rate}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Late Fee:</span> {provider.late_fee}
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.partner_merchants.slice(0, 3).map((merchant, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {merchant}
              </Badge>
            ))}
            {provider.partner_merchants.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.partner_merchants.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ESIMCard = ({ provider }: { provider: (typeof esimData)[0] }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{provider.provider}</CardTitle>
          <div className="flex gap-1">
            {provider.type.map((type, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {provider.plans.map((plan, idx) => (
          <div key={idx} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
            <a href={plan.link} target="_blank" rel="noopener noreferrer">
              <h4 className="font-medium text-sm">{plan.name}</h4></a>
              
              <span className="text-sm font-semibold text-green-600">{'price' in plan ? plan.price : plan.price_range}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {"data" in plan && plan.data && (
                <div className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  <span>{plan.data}</span>
                </div>
              )}
              {"validity" in plan && plan.validity && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{plan.validity}</span>
                </div>
              )}
              {"voice" in plan && plan.voice && (
                <div className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  <span>{plan.voice}</span>
                </div>
              )}
              {"sms" in plan && plan.sms && <div className="text-xs">SMS: {plan.sms}</div>}
            </div>
            {"benefits" in plan && plan.benefits && (
              <div className="flex flex-wrap gap-1">
                {plan.benefits.map((benefit, benefitIdx) => (
                  <Badge key={benefitIdx} variant="secondary" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            )}
            {"features" in plan && plan.features && (
              <div className="flex flex-wrap gap-1">
                {plan.features.map((feature, featureIdx) => (
                  <Badge key={featureIdx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
            {"details" in plan && plan.details && <p className="text-xs text-muted-foreground">{plan.details}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="relative">
      {/* Always visible banner */}
      <div className="fixed top-4 right-0 transform -translate-x-1/2 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              See BNPL and E-Sim Options
              <Smartphone className="ml-2 h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold">BNPL & eSIM Options</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <Tabs defaultValue="bnpl" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bnpl" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    BNPL Services
                  </TabsTrigger>
                  <TabsTrigger value="esim" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    eSIM Plans
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bnpl" className="mt-4">
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-4 pr-4">
                      <div className="text-sm text-muted-foreground mb-4">
                        Compare {bnplData.length} Buy Now Pay Later services available in India
                      </div>
                      {bnplData.map((provider, idx) => (
                        <BNPLCard key={idx} provider={provider} />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="esim" className="mt-4">
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-4 pr-4">
                      <div className="text-sm text-muted-foreground mb-4">
                        Compare eSIM plans from {esimData.length} providers including Indian carriers and international
                        options
                      </div>
                      {esimData.map((provider, idx) => (
                        <ESIMCard key={idx} provider={provider} />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Auto-expand indicator */}
      {shouldAutoExpand && !isOpen && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="bg-white/90 backdrop-blur-sm shadow-lg animate-pulse"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      )}

      
    </div>
  )
}
