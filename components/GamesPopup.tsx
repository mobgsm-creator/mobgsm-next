"use client"
import FormPopup from "./formPopup"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
export default function GamePopupClient() {
    const [showForm, setShowForm] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        // Show popup after a short delay
        const timer = setTimeout(() => setIsOpen(true), 15000)
        return () => clearTimeout(timer)
    }, [])   

    
    return (
    <>
      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close popup"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="relative w-full h-auto">
              <img
                src="/landline_popup.webp"
                alt="International calls to any mobile or landline in the world without the high cost."
                className="w-full h-auto block"
              />

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center whitespace-nowrap absolute bottom-[23%] left-[38%] h-[10%] w-[24%] text-[12px] sm:text-sm sm:bottom-[118px] sm:left-[350px] sm:h-12 md:w-60 bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                aria-label="Choose a local landline"
              >
                <span className="block sm:hidden text-[clamp(10px,2vw,14px)]">Choose a Local Landline</span>
                <span className="hidden sm:block text-[clamp(10px,2vw,14px)]">Choose a Local Landline</span>

              </button>
              {showForm && (
                <FormPopup
                  onClose={() => {
                    setShowForm(false)
                    setIsOpen(false)
                  }
                    
                  }
                  currentProduct={"Test Games $19"}
                
                />
              )}
            </div>
          </div>
        </div>
      )}
      </>
    )
    
}