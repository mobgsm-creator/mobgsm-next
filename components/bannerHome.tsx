"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import Image from "next/image"
import { Rajdhani } from "next/font/google";
import FormPopup from "./formPopup";
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});
export default function HomeBanner() {
    const [clicked, setClicked] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    

    const addClick = async () => {
        if (!clicked) {
            setClicked(true);
        const credit_response = await fetch("/api/clickCounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              button: "landlines-home"
             }),
          })
          if (!credit_response.ok) {
            const err = await credit_response.json().catch(() => ({}));
            console.error("Failed to Increment:", err);
            return;
          }
    
          console.log("Count incrememnt success:", await credit_response.json());
        }
    }

    
    return (
    <>
    <div className='flex flex-col items-center justify-center gap-3'>
    <div className={`${rajdhani.variable} relative`}>
    <Image
      src="/mobgsm_banner.webp"
      alt="Cheap International Calls."
      className="flex items-center justify-center h-auto"
      width={1920}
      height={600}
      priority
    />

<span
      className="
         absolute
      top-3/4
      left-[7%]
      -translate-y-1/2
      font-bold
      text-white
      text-[20px] 
      sm:text-[36px] sm:leading-[1]
      md:text-[50px] md:leading-[1]
      lg:text-[72px] lg:leading-[1]
      leading-[1.2]   
      w-[120%] max-w-[1920px]
      text-left
      drop-shadow-lg
      rajdhani-font
      "
    >
      International calls to any mobile or
      <br />
      landline in the world without the
      <br />
      high cost
    </span>

  </div>
              <Button onClick={() => {addClick();
                setShowForm(true);}
              } className="text-xs w-25">
        <span className="text-[12px]">Choose a Local Landline</span>
      </Button>
              <Image
                src="/flags.png"
                alt="Africa."
                className="w-full h-auto block sm:w-1/2"
                width={1200}
                height={200}
                priority
              /></div>
              {showForm && (
    <FormPopup
      onClose={() => setShowForm(false)}
      currentProduct={"landline"}
      ></FormPopup>)}
     
 
      </>
    )
    
}