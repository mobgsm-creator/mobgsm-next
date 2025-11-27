"use client"

import { Button } from "./ui/button"

export default function HomeBanner() {
    

    const addClick = async () => {
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

    
    return (
    <>
    <div className='flex flex-col items-center justify-center gap-3'>
      <img
                src="/mobgsm_banner.jpg"
                alt="Cheap International Calls."
                className="w-full h-auto block"
              />
              <Button onClick={() => addClick()} className="text-xs w-25">
        <span className="text-[8px]">Choose a Local Landline</span>
      </Button>
              <img
                src="/flags.png"
                alt="Africa."
                className="w-full h-auto block sm:w-1/2"
              /></div>
     
 
      </>
    )
    
}