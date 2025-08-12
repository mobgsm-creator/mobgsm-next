"use client";
// components/ComparePopup.tsx
import { useState } from "react"


type ComparePopupProps = {
  onClose: () => void
}

export default function FormPopup({ onClose }: ComparePopupProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    country: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("https://mobgsm.com/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData ),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to submit form")
      setMessage("✅ Form submitted successfully!")
      setFormData({ first_name: "", last_name: "", mobile: "", email: "", country: "" })
    } catch (err: any) {//eslint-disable-line @typescript-eslint/no-explicit-any
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-[50%] sm:w-[45%] max-w-7xl relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

       

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">Fill Your Details</h3>

          <div className="flex flex-col gap-3 ">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-black"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && <p className="mt-2">{message}</p>}
        </form>
      </div>
    </div>
  )
}
