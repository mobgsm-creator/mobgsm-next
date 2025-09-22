
import Link from "next/link"
import type { Product, ESIMProvider, BNPLProvider, reloadly } from "../lib/types"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useState} from "react";
import Turnstile from '../components/Turnstile';
import ComparePopup from "./comparePopup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import FormPopup from "./formPopup"
import Image from "next/image"
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircle2 } from "lucide-react";
import { Session } from "next-auth";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
type ProductCardProps = {
  product: Product[] | ESIMProvider[] | BNPLProvider[] | reloadly[];
  session: Session | null;
  balance: { amount: number; currency: string }[];
};
const countryToCurrency: {[key: string]: string} = {
  AE: "AED",
  AF: "AFN",
  AG: "XCD",
  AI: "XCD",
  AL: "ALL",
  AM: "AMD",
  AO: "AOA",
  AR: "ARS",
  AS: "USD",
  AT: "EUR",
  AU: "AUD",
  AW: "AWG",
  AZ: "AZN",
  BB: "BBD",
  BD: "BDT",
  BE: "EUR",
  BF: "XOF",
  BG: "BGN",
  BH: "BHD",
  BI: "BIF",
  BJ: "XOF",
  BM: "BMD",
  BO: "BOB",
  BR: "BRL",
  BS: "BSD",
  BW: "BWP",
  BY: "BYN",
  BZ: "BZD",
  CA: "CAD",
  CD: "CDF",
  CF: "XAF",
  CG: "XAF",
  CH: "CHF",
  CI: "XOF",
  CL: "CLP",
  CM: "XAF",
  CN: "CNY",
  CO: "COP",
  CR: "CRC",
  CU: "CUP",
  CY: "EUR",
  CZ: "CZK",
  DE: "EUR",
  DJ: "DJF",
  DK: "DKK",
  DM: "XCD",
  DO: "DOP",
  DZ: "DZD",
  EC: "USD",
  EE: "EUR",
  EG: "EGP",
  ER: "ERN",
  ES: "EUR",
  ET: "ETB",
  FI: "EUR",
  FJ: "FJD",
  FR: "EUR",
  GA: "XAF",
  GB: "GBP",
  GD: "XCD",
  GE: "GEL",
  GH: "GHS",
  GM: "GMD",
  GN: "GNF",
  GQ: "XAF",
  GR: "EUR",
  GT: "GTQ",
  GW: "XOF",
  GY: "GYD",
  HN: "HNL",
  HT: "HTG",
  ID: "IDR",
  IE: "EUR",
  IL: "ILS",
  IN: "INR",
  IQ: "IQD",
  IR: "IRR",
  IS: "ISK",
  IT: "EUR",
  JM: "JMD",
  JO: "JOD",
  JP: "JPY",
  KE: "KES",
  KG: "KGS",
  KH: "KHR",
  KM: "KMF",
  KN: "XCD",
  KR: "KRW",
  KW: "KWD",
  KY: "KYD",
  KZ: "KZT",
  LA: "LAK",
  LB: "LBP",
  LK: "LKR",
  LR: "LRD",
  LS: "LSL",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  LY: "LYD",
  MA: "MAD",
  MD: "MDL",
  MG: "MGA",
  ML: "XOF",
  MM: "MMK",
  MN: "MNT",
  MR: "MRU",
  MS: "XCD",
  MT: "EUR",
  MU: "MUR",
  MV: "MVR",
  MW: "MWK",
  MX: "MXN",
  MY: "MYR",
  MZ: "MZN",
  NA: "NAD",
  NE: "XOF",
  NG: "NGN",
  NI: "NIO",
  NL: "EUR",
  NO: "NOK",
  NP: "NPR",
  NZ: "NZD",
  OM: "OMR",
  PA: "PAB",
  PE: "PEN",
  PH: "PHP",
  PK: "PKR",
  PL: "PLN",
  PR: "USD",
  PT: "EUR",
  PY: "PYG",
  QA: "QAR",
  RO: "RON",
  RS: "RSD",
  RU: "RUB",
  RW: "RWF",
  SA: "SAR",
  SC: "SCR",
  SD: "SDG",
  SE: "SEK",
  SG: "SGD",
  SI: "EUR",
  SK: "EUR",
  SL: "SLL",
  SN: "XOF",
  SO: "SOS",
  SR: "SRD",
  SV: "USD",
  SZ: "SZL",
  TC: "USD",
  TD: "XAF",
  TG: "XOF",
  TH: "THB",
  TJ: "TJS",
  TL: "USD",
  TN: "TND",
  TR: "TRY",
  TT: "TTD",
  TZ: "TZS",
  UA: "UAH",
  UG: "UGX",
  US: "USD",
  UY: "UYU",
  UZ: "UZS",
  VC: "XCD",
  VE: "VES",
  VG: "USD",
  VN: "VND",
  WS: "WST",
  YE: "YER",
  ZA: "ZAR",
  ZM: "ZMW",
  ZW: "ZWL"
};

export default function ProductCard({ product, session, balance }: ProductCardProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"giftcard" | "topup" | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCredits, setIsCredits] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompare, setShowCompare] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [SelectedValue, setSelectedValue] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [PhoneValue, setPhoneValue] = useState({
    countryCode: "",
    number: ""
  })
  const [operatorId,setOperatorId] = useState(0)
  const [EmailValue, setEmailValue] = useState("")
  const [airtimeOperatorData, setAirtimeOperatorData] = useState([])
  const [formData, setFormData] = useState({
    operatorId: 0,
    inputValue: "",
    selectedValue: "",
    quantity: "",
    userId: "",
    senderName: "",
    emailValue: "",
    recipientCountryCode: "",
    recipientNumber: "",
  });
 
  const VerificationBox = () => (
    <>
    <div className="flex flex-col items-center">
      
      <p className="mb-4 text-gray-600">Please complete the verification to continue</p>
      {(
        <Turnstile
          onVerify={() => setIsVerified(true)}
        />
      )}
    </div></>
  )
  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const getAirtimeOperatorData = async (operatorId: number) => {
    
    const res = await fetch(`/api/airtime_operator_data?operatorId=${operatorId}`);
    const data = await res.json();
    //console.log(data)
    const result = data?.geographicalRechargePlans?.[0]?.localAmounts 
             ?? data?.suggestedAmounts ?? data?.localFixedAmounts;
    return result

  }
  
  
  const handleGiftcard = async () => {
    // Build request payload based on formData
    const data = {
      productId: formData.operatorId,
      quantity: 1, // keep static or make dynamic if needed
      unitPrice: Number(formData.inputValue) || Number(formData.selectedValue), 
      productAdditionalRequirements: {
        userId: formData.userId || "12345", // fallback if not set
      },
      senderName: formData.senderName,
      customIdentifier: `txn_${Date.now()}`,
      recipientEmail: formData.emailValue,
      recipientPhoneDetails: {
        countryCode: formData.recipientCountryCode,
        phoneNumber: formData.recipientNumber,
      },
      preorder : false, // or true based on your logic
     
    };
  
    console.log("Giftcard Purchase Request:", data);
  
    try {
      const response = await fetch("/api/purchase_giftcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Giftcard purchase failed");
  
      const result = await response.json();
      console.log("Giftcard Purchase Success ✅:", result);
      alert("Giftcard purchase successful 🎉");
      const debit_response = await fetch("/api/debit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Number(formData.inputValue) || Number(formData.selectedValue),
          currency: countryToCurrency[formData.recipientCountryCode || PhoneValue.countryCode], //eslint-disable-line
          email: session?.user?.email
         }),
      })
      const debit_result = await debit_response.json();
      console.log("Debit Success",debit_result)
      
    } catch (error) {
      console.error("Giftcard Purchase Error ❌:", error);
      alert("Giftcard purchase failed");
    }
    finally {
      setShowPayment(false)
      setClientSecret(null)
      setPendingAction(null)
    }
  };
  
  
  const handleTopup = async () => {
    
    const data = {
      operatorId: operatorId,
      amount: Number(inputValue) || Number(SelectedValue),
      useLocalAmount: true,
      customIdentifier: `txn_${Date.now()}`,
      recipientEmail: EmailValue,
      recipientPhone: {
        countryCode: PhoneValue.countryCode,
        phoneNumber: PhoneValue.number,
      },
      

    }
    //console.log(data)
    try {
      const response = await fetch("/api/topup_airtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(`${result.details.message}... If payment was successful, your credits have not been deducted and can be reused.`)
      alert("Topup successful ✅")
      const debit_response = await fetch("/api/debit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Number(formData.inputValue) || Number(formData.selectedValue),
          currency: countryToCurrency[formData.recipientCountryCode || PhoneValue.countryCode], //eslint-disable-line
          email: session?.user?.email
         }),
      })
      const debit_result = await debit_response.json();
      console.log("Debit Success",debit_result)
      //Debit API
    } catch (error) {
      console.error("Topup Error:", error)
      alert(`Topup failed ❌ ${error}`)
    }
    finally {
      setShowPayment(false)
      setClientSecret(null)
      setPendingAction(null)
    }
  }
  
  const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
    console.log("Rendering PaymentForm with clientSecret:", clientSecret);

    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
  
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required"
      });
  
      if (error) {
        console.error(error.message);
        alert(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(); // 🔥 call Giftcard/Topup here
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
        <PaymentElement />
        {!isVerified ? (
          // Show verification box if not verified
          <VerificationBox />  
              
            ) : (
        <button
          type="submit"
          disabled={!stripe}
          className="bg-black text-white px-4 py-2 rounded mt-4"
        >
          Pay
        </button>)}</div> 
        
      </form>
    );
  };
  

  const renderValues = (product : reloadly, ) => {//Eslint-disable-line
    
    if (product.img_link.includes("s3.amazonaws")) {
     
      
    
    // const values = product.sendable_values.includes("~")
    // ? product.sendable_values.split("~")
    // : product.sendable_values.includes(",")
    // ? product.sendable_values.split(",")
    // : [product.sendable_values]
    //const values = airtimeOperatorData
      return (
        <>
        {!showPayment && clientSecret && (
           <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl shadow-md max-w-md mx-auto">
           <CheckCircle2 className="text-green-600 w-12 h-12 mb-3" />
           <h2 className="text-2xl font-bold text-green-700 mb-2">
             Payment Successful
           </h2>
           <p className="text-gray-700 text-center mb-4">
             Thank you for your purchase! Your payment has been processed
             successfully. You’ll receive a confirmation email shortly.
           </p>
           <button
             onClick={() => {
                window.location.href = "/";
                setShowPayment(false)
                setClientSecret(null)
                setPendingAction(null)
             }}
             className="bg-black text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
           >
             Back to Home
           </button>
         </div>
        )}
        {showPayment && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              onSuccess={async () => {
                if (pendingAction === "giftcard") handleGiftcard();
                if (pendingAction === "topup") handleTopup();
                setShowPayment(false);
                const credit_response = await fetch("/api/credit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    amount: Number(formData.inputValue) || Number(formData.selectedValue),
                    currency: countryToCurrency[formData.recipientCountryCode || PhoneValue.countryCode], //eslint-disable-line
                    email: session?.user?.email
                   }),
                })
                if (!credit_response.ok) {
                  const err = await credit_response.json().catch(() => ({}));
                  console.error("Failed to credit:", err);
                  return;
                }
          
                console.log("Credit success:", await credit_response.json());
              }}
            />
          </Elements>
        )}
          {!showPayment && !clientSecret && (<>
          <DialogDescription className="text-sm font-semibold mb-2">Select Amount</DialogDescription>
          <div className="h-20 overflow-x-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {airtimeOperatorData.length > 1 ? (airtimeOperatorData.map((val, i) => {
              const local = val
              return (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => {
                    setSelectedValue(local)
                    setInputValue(local)
                    setOperatorId(product.operator_id)
                    
                  }}
                >
                  {local}
                </Button>
              )
            })): ( <p>
              Provider Not Supported
            </p>)
          }
          </div></div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter amount"
          />
          <input
            type="text"
            value={EmailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter Email"
          />
          <div className="flex gap-2 mb-4">
  {/* Country Code Input */}
  <input
    type="text"
    value={PhoneValue.countryCode || ""}
    onChange={(e) =>
      setPhoneValue({
        ...PhoneValue,
        countryCode: e.target.value, // update code only
      })
    }
    className="w-1/3 border rounded p-2"
    placeholder="IN, US, CN, PH..."
  />

  {/* Phone Number Input */}
  <input
    type="text"
    value={PhoneValue.number || ""}
    onChange={(e) =>
      setPhoneValue({
        ...PhoneValue,
        number: e.target.value, // update number only
      })
    }
    className="w-2/3 border rounded p-2"
    placeholder="Verified Pre-Paid Phone Number"
  />
</div><div className="flex flex-col items-center gap-3 mb-4">
        <span className="text-sm font-medium">Use Credits</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isCredits}
            onChange={(e) => setIsCredits(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition"></div>
          <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-5"></div>
        </label>
        
      </div>
<Button
  onClick={async () => {
    
    // Stripe flow
    const zeroDecimalCurrencies = [
      "BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF",
      "UGX","VND","VUV","XAF","XOF","XPF"
    ];
    const currency = countryToCurrency[PhoneValue.countryCode]; // eslint-disable-line
    const amount = zeroDecimalCurrencies.includes(currency) 
      ? Number(inputValue) 
      : Number(inputValue) * 100;
    if (!isCredits) {
      const res = await fetch("/api/stripe/createPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }), // cents
      });

      const data = await res.json();
      if (data.clientSecret) {
        
        setClientSecret(data.clientSecret);
        setPendingAction("topup");
        setShowPayment(true);
      }
  } else {
    // Placeholder credits flow
    console.log(balance[0].amount, Number(inputValue))
    if(balance[0].amount >= Number(inputValue)) {
      
   
      handleTopup()
    }
    else { alert("Insufficient Credits")}
    
    // You can directly fulfill or open another UI flow here
    // Example: call your backend API to deduct credits
    // await fetch("/api/credits/use", { method: "POST", body: JSON.stringify({ ...formData }) })
  }
}}
>
  Submit Topup
</Button></>)}


          
        </>
      )
    } else if (product.img_link.includes("cdn.reloadly")) {
      const values = product.sendable_values.includes("~")
        ? product.sendable_values.split("~")
        : product.sendable_values.includes(",")
        ? product.sendable_values.split(",")
        : [product.sendable_values]
        //console.log(product.operator, values)
      return (
        <>
        {!showPayment && clientSecret && (
           <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl shadow-md max-w-md mx-auto">
           <CheckCircle2 className="text-green-600 w-12 h-12 mb-3" />
           <h2 className="text-2xl font-bold text-green-700 mb-2">
             Payment Successful
           </h2>
           <p className="text-gray-700 text-center mb-4">
             Thank you for your purchase! Your payment has been processed
             successfully. You’ll receive a confirmation email shortly.
           </p>
           <button
             onClick={() => {
                window.location.href = "/";
                setShowPayment(false)
                setClientSecret(null)
                setPendingAction(null)
             }}
             className="bg-black text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
           >
             Back to Home
           </button>
         </div>
        )}
        {showPayment && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <div className="flex flex-col items-center">
            <PaymentForm
              onSuccess={async () => {
                if (pendingAction === "giftcard") handleGiftcard();
                if (pendingAction === "topup") handleTopup();
                setShowPayment(false);
                //fetch api/credit post {amount, currency, email}
                const credit_response = await fetch("/api/credit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    amount: Number(formData.inputValue) || Number(formData.selectedValue),
                    currency: countryToCurrency[formData.recipientCountryCode || PhoneValue.countryCode], //eslint-disable-line
                    email: session?.user?.email
                   }),
                })
                if (!credit_response.ok) {
                  const err = await credit_response.json().catch(() => ({}));
                  console.error("Failed to credit:", err);
                  return;
                }
          
                console.log("Credit success:", await credit_response.json());
                
                  
                
                
              }}
            /></div>
          </Elements>
        )}
       {!showPayment && !clientSecret && (<>
      <DialogDescription className="text-sm font-semibold mb-2">
        Select Amount in Local Currency
      </DialogDescription>

      <div className="flex flex-wrap gap-2 mb-4">
        {values.length > 2 ? (
          values.map((val, i) => {
            const local = Number(val.trim()).toFixed(2)
            return (
              <Button
                key={i}
                variant="outline"
                onClick={() => handleChange("inputValue", local)}
              >
                {local}
              </Button>
            )
          })
        ) : values.length === 1 ? (
          <p>Value: {values[0]}</p>
        ) : (
          <p>
            Enter a value between Min value: {values[0]} and Max value: {values[1]}
          </p>
        )}
      </div>
      <div className="flex gap-2 mb-4">
      <input
        type="number"
        value={formData.quantity}
        onChange={(e) => handleChange("quantity", e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="Enter Quanitity"
      />
      <input
        type="number"
        value={formData.inputValue}
        onChange={(e) => handleChange("inputValue", e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="Enter Amount"
      /></div>

      

      <input
        type="text"
        value={formData.senderName}
        onChange={(e) => handleChange("senderName", e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="Sender Name"
      />

      <input
        type="email"
        value={formData.emailValue}
        onChange={(e) => handleChange("emailValue", e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="Recipient Email"
      />
      <div className="flex gap-2 mb-4">
      <input
        type="tel"
        value={formData.recipientCountryCode}
        onChange={(e) => handleChange("recipientCountryCode", e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="US, IN, PK, PH, CN ..."
      />
      <input
        type="tel"
        value={formData.recipientNumber}
        onChange={(e) => handleChange("recipientNumber", e.target.value)}
        className="w-full border rounded p-2 mb-4"
        placeholder="Recipient Phone"
      />
       </div><div className="flex flex-col items-center gap-3 mb-4">
        <span className="text-sm font-medium">Use Credits</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isCredits}
            onChange={(e) => setIsCredits(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition"></div>
          <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-5"></div>
        </label>
        
      </div>

     
<div className='flex items-center justify-center'>
<Button
  className="w-1/3 px-6"
  onClick={async () => {
    
      // Stripe flow
      const zeroDecimalCurrencies = [
        "BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF",
        "UGX","VND","VUV","XAF","XOF","XPF"
      ];
      const currency = countryToCurrency[formData.recipientCountryCode]; // eslint-disable-line
      const amount = zeroDecimalCurrencies.includes(currency) 
        ? Number(formData.inputValue) 
        : Number(formData.inputValue) * 100;
      if (!isCredits) {
        const res = await fetch("/api/stripe/createPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }), // cents
        });

        const data = await res.json();
        if (data.clientSecret) {
          
          setClientSecret(data.clientSecret);
          setPendingAction("giftcard");
          setShowPayment(true);
        }
    } else {
      // Placeholder credits flow

      
      if(balance[0].amount >= Number(formData.inputValue)) {
   
     
        handleGiftcard()
      }
      else { alert("Insufficient Credits")}
      
      // You can directly fulfill or open another UI flow here
      // Example: call your backend API to deduct credits
      // await fetch("/api/credits/use", { method: "POST", body: JSON.stringify({ ...formData }) })
    }
  }}
>
  Submit
</Button></div></>
)}
    </>
      )
    }
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + product.length) % product.length);
  };

  const handleCompare = () => {
    setShowCompare(true)

  }

  const handleForm = () => {
    setShowForm(true)

  }
  
  const currentProduct = product?.[currentIndex];

  if (!currentProduct) {
    return <div>Loading product...</div>; // or a spinner
  }
  
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
        {showForm && (
    <FormPopup
      onClose={() => setShowForm(false)}
      currentProduct={currentProduct}
     
    />
  )}
        
        {currentProduct.product_links?.startsWith('https') ? (
  
  <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
  <Image
    src={currentProduct.img_link}
    alt={currentProduct.product_name}
    className="h-20 w-20 object-contain p-1 drop-shadow-sm"
    width={40} height={40}

  />
</div>
  
) : (
  <Link href={`/mobile/${currentProduct.product_links}`}>
  <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
  <Image
    src={currentProduct.img_link}
    alt={currentProduct.product_name}
    className="h-20 w-20 object-contain p-1 drop-shadow-sm"
    width={40} height={40}
  />
</div></Link>
)}
        {currentProduct.discount ? 
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {currentProduct.discount}
        </Badge> : null}
      </div>
      
      <div className="p-4">
      {currentProduct.store_logo && (
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={currentProduct.store_logo}
            alt="Store logo"
            width={60}
            height={20}
            className="h-5 w-auto"
       
          />
        </div>)}

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {currentProduct.product_name}
        </h3>
        {currentProduct.mrp && (<>
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


        </div></>)}
        <div className="flex flex-col items-center gap-2">
  <div className="flex justify-center gap-8">
  
      <Button onClick={handleForm} className="text-xs w-25">
        <span className="text-xs">Request Quote</span>
      </Button>
  

    <Button onClick={handleCompare} className="text-xs w-25">
      <span className="text-xs text-center">Detail</span>
    </Button>
  </div>

  {currentProduct.payment_options && (
    <p className="text-xs text-gray-500 text-center">
      {currentProduct.payment_options}
    </p>
  )}

  {showCompare && (
    <ComparePopup
      products={product.filter(isProduct)}
      onClose={() => setShowCompare(false)}
    />
  )}
</div>

        {currentProduct.mrp && (<>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div></>)}
      </div></>)}
      {isBNPL(currentProduct)
              && (<>
              {showForm && (
    <FormPopup
      onClose={() => setShowForm(false)}
      currentProduct={currentProduct}
     
    />
  )}
              
              <div className="relative">
              <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
                <Image
                  src={currentProduct.Image_URL}
                  alt={currentProduct.Name}
                  className="h-20 w-20 object-contain p-1 drop-shadow-sm"
                  width={40} height={40}
                />
              </div>
                <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">
                  BNPL
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {currentProduct.Name}
                </h3>

                <div className="space-y-1 text-sm text-gray-700">
  {[
    { label: "Limit", value: currentProduct.Credit_Limit },
    { label: "Rate", value: currentProduct.Interest_Rate },
    { label: "KYC", value: currentProduct.KYC ? "Yes" : "No" },
    { label: "Partner", value: currentProduct.NBFC_Partner },
  ].map((item) => (
    <div key={item.label} className="grid grid-cols-3 gap-2">
      <span className="font-medium text-gray-800 col-span-1">{item.label}</span>
      <span className="col-span-2">{item.value}</span>
    </div>
  ))}
</div>



<div className="mt-auto flex justify-center pt-4">
      <Button onClick={handleForm} className="mb-8 mt-4 w-25">
        <span className="text-xs">Request Quote</span>
      </Button>
    </div>
              </div>
              </>)}
              {isESIM(currentProduct) && (<>
                {showForm && (
    <FormPopup
      onClose={() => setShowForm(false)}
      currentProduct={currentProduct}
     
    />
  )}
                <div className="flex flex-col h-full border rounded-lg overflow-hidden">
              <div className="relative">
              <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2 hover:shadow-lg transition-transform transform hover:scale-105">
                <Image
                  src={currentProduct.img_link}
                  alt={currentProduct.provider}
                  className="h-20 w-20 object-contain p-1 drop-shadow-sm"
                  width={40} height={40}
                />
              </div>
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
    
<div className="flex items-center flex-wrap gap-2 mt-2">
 
  {currentProduct.type.slice(0,3).map((t, idx) => (
    <span
      key={idx}
      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
    >
      {t}
    </span>
  ))}
</div>


          {/* Plan List */}
          <table className="w-full border-collapse mt-2">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-2 text-left">Plan</th>
      <th className="p-2 text-left">Price</th>
      <th className="p-2 text-left">Validity</th>
    </tr>
  </thead>
  <tbody>
    {currentProduct.plans.slice(0,3).map((plan, index) => (
      <tr key={index} className="border-b">
        <td className="p-2">
          <Link
            href={plan.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {plan.name}
          </Link>
        </td>
        <td className="p-2">{plan.price || plan.price_range}</td>
        <td className="p-2">{plan.validity || "—"}</td>
      </tr>
    ))}
  </tbody>
</table>


        </div>


      
      </div>
     
  
      <div className="mt-auto flex justify-center pt-4">
      <Button onClick={handleForm} className="mb-8 mt-4 w-25">
        <span className="text-xs">Request Quote</span>
      </Button>
    </div>
</div>
      
      </>)

      }{isReloadly(currentProduct) && (
        <>
        {showForm && (
    <FormPopup
      onClose={() => setShowForm(false)}
      currentProduct={currentProduct}
     
    />
  )}
          <div
  className="relative cursor-pointer p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-sm hover:shadow-lg transition-transform transform hover:scale-105"

>
  {/* Product Type Tag */}
  <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
    {currentProduct.code} {/* e.g., "Data PIN", "eSIM" */}
  </span>

  {/* Discount Badge */}
  {currentProduct.discount && (
    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white">
      {currentProduct.discount}
    </Badge>
  )}

 

  {/* Logo */}
  <div className="flex items-center justify-center h-32 w-full bg-white rounded-md shadow-inner p-2"
  onClick={async () => {
    if (!session) {
      alert("Please sign in to continue.");
      window.location.href = "/register";
      return
    }
    if (currentProduct.img_link?.includes("s3.amazonaws")) {
      // Fetch operator data & set state
      const localAmounts = await getAirtimeOperatorData(currentProduct.operator_id);
      console.log("Local amounts:", localAmounts);
      setOperatorId(currentProduct.operator_id);
      setAirtimeOperatorData(localAmounts);
      setIsOpen(true);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        operatorId: currentProduct.operator_id,
      }));
      
      setIsOpen(true);
    }
  }}>
    <Image
      src={currentProduct.img_link}
      alt={currentProduct.operator}
      className="h-20 w-20 object-contain p-1 drop-shadow-sm"
      width={40} height={40}
      priority
     
    />
  </div>

  {/* Brand/Operator Name */}
  <p className="mt-3 text-center text-sm font-semibold text-gray-800 truncate">
    {currentProduct.operator}
  </p>

  {/* Min/Max Values */}
  {/* {currentProduct.sendable_values && (
    <p className="text-xs text-gray-500 text-center">
      {currentProduct.sendable_values.includes("~")
        ? `Min: ${currentProduct.sendable_values.split("~")[0]} / Max: ${currentProduct.sendable_values.split("~")[1]}`
        : currentProduct.sendable_values.includes(",") ? `Min: ${currentProduct.sendable_values.split(",")[0]} / Max: ${currentProduct.sendable_values.split(",").slice(-1)[0]}` : `Value: ${currentProduct.sendable_values}`}
    </p>
  )} */}

<div className="flex justify-center gap-3 mt-2">
<Button
  onClick={async () => {
    if (!session) {
      alert("Please sign in to continue.");
      window.location.href = "/register";
      return
    }
    if (currentProduct.img_link?.includes("s3.amazonaws")) {
      // Fetch operator data & set state
      const localAmounts = await getAirtimeOperatorData(currentProduct.operator_id);
      console.log("Local amounts:", localAmounts);
      setOperatorId(currentProduct.operator_id);
      setAirtimeOperatorData(localAmounts);
      setIsOpen(true);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        operatorId: currentProduct.operator_id,
      }));
      
      setIsOpen(true);
    }
  }}
  className="text-xs w-25"
>
  Buy Now
</Button>


      <Button onClick={handleForm} className="text-xs w-25">
        <span className="text-xs">Request Quote</span>
      </Button>

</div>


  
</div>


          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentProduct.operator}</DialogTitle>
              </DialogHeader>

              {renderValues(currentProduct)}

              <DialogFooter>
                
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    
    </div>
    
  );
  
}
