// WalletPopup.tsx
'use client'

import { useState } from 'react'
import { Wallet, CheckCircle2 } from 'lucide-react'
import { Button } from './ui/button'
import { loadStripe } from "@stripe/stripe-js";
import Turnstile from './Turnstile';
import {
  Elements,PaymentElement,useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Session } from 'next-auth';
interface WalletPopupProps {
  balance: { amount: number; currency: string }[]
  session: Session | null
}
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,

    DialogFooter
  } from "@/components/ui/dialog"

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function WalletPopup({ balance, session }: WalletPopupProps) {
  const [open, setOpen] = useState(false)
  const [currencyValue, setCurrencyValue] = useState('USD')
  const [amountValue, setAmountValue] = useState(0)
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [successfulPayment, setSuccessfulPayment] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
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
        onSuccess();
        setSuccessfulPayment(true) // 🔥 call Giftcard/Topup here
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

  return (
    
    <div className="relative z-50">
      <div
        className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-2xl shadow-sm border cursor-pointer mt-2"
        onClick={() => setOpen(!open)}
      >
        <Wallet className="w-5 h-5 text-black" />
        
      </div>
      <Dialog open={open}  onOpenChange={(isOpen) => {
    setOpen(isOpen); // update the state
    if (!isOpen) {
      setPaymentCreated(false)
      setClientSecret(null)
      setSuccessfulPayment(false)
      console.log("Dialog closed");
      // You can put any other logic here, e.g. reset fields
    }
  }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-center'>{`Welcome ${session?.user?.name}`}</DialogTitle>
              </DialogHeader>
      {open && !paymentCreated && (
        <>
        <div className=" mt-2 right-0 bg-white border shadow-lg rounded p-4 z-50">
          <p className="text-sm font-semibold">Wallet Details</p>
          {balance.map((b, idx) => (
            <p key={idx} className="text-sm">{b.amount} {b.currency}</p>
          ))}
        </div>
        <div className='flex flex-col items-center'>
        <div className="flex gap-2 mb-4">
  {/* Currency Input */}
  <input
    type="text"
    value={currencyValue || ""}
    onChange={(e) =>
      setCurrencyValue(e.target.value.toUpperCase()) // update country code only
    }
    className="w-1/3 border rounded p-2"
    placeholder="IN, US, CN, PH..."
  />

  {/* Amount Input */}
  <input
    type="text"
    value={amountValue || ""}
    onChange={(e) =>
      setAmountValue(Number(e.target.value))
    }
    className="w-2/3 border rounded p-2"
    placeholder="Amount"
  /></div>
      
      <Button className='w-1/3'
  onClick={async () => {
    
    // Stripe flow
    const zeroDecimalCurrencies = [
      "BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF",
      "UGX","VND","VUV","XAF","XOF","XPF"
    ];
    const currency = currencyValue; // eslint-disable-line
    const amount = zeroDecimalCurrencies.includes(currency) 
      ? Number(amountValue) 
      : Number(amountValue) * 100;
   
      const res = await fetch("/api/stripe/createPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }), // cents
      });

      const data = await res.json();
      if (data.clientSecret) {
        
        setClientSecret(data.clientSecret);
        setPaymentCreated(true)
       
      }
    
  }
  }
>
  Submit Topup
</Button></div></>
)}
{open && clientSecret && paymentCreated && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <div className="flex flex-col items-center">
            <PaymentForm
              onSuccess={async () => {
            
                //fetch api/credit post {amount, currency, email}
                const credit_response = await fetch("/api/credit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    amount: Number(amountValue) ,
                    currency: currencyValue.toLocaleUpperCase(), //eslint-disable-line
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
        {successfulPayment && clientSecret && (
           <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl shadow-md max-w-md mx-auto">
           <CheckCircle2 className="text-green-600 w-12 h-12 mb-3" />
           <h2 className="text-2xl font-bold text-green-700 mb-2">
             Payment Successful
           </h2>
           <p className="text-gray-700 text-center mb-4">
             Thank you for your purchase! Your payment has been processed
             successfully. Please refresh page to view updated balance.
           </p>
           <button
             onClick={() => {
                window.location.href = "/";

                setClientSecret(null)
              
             }}
             className="bg-black text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
           >
             Back to Home
           </button>
         </div>
        )}
        <DialogFooter>
                
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
    
  )
}
