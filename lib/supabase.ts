import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Product, BNPLProvider, ESIMProvider, reloadly, Device } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side function to get products
  export async function getProducts(country: string): Promise<Product[]> {
    //console.log("Fetching products from Supabase...")

    try {
      const response = await fetch(`https://mobgsm.com/api/products?country=${country}`, {
      cache: "force-cache",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9",
        "Referer": "https://mobgsm.com/",
      }, 
    })
    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
   
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
} 

// Server-side function to get products
export async function getBNPL(): Promise<BNPLProvider[]> {

  try {
    const response = await fetch(`https://mobgsm.com/api/BNPL`, {
      cache: "force-cache",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9",
        "Referer": "https://mobgsm.com/",
      }, // Disable caching for real-time data
    })
    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Server-side function to get products
export async function getESIM(): Promise<ESIMProvider[]> {
  //console.log("cache")
  try {

    const response = await fetch(`https://mobgsm.com/api/ESIM`, {
      cache: "force-cache",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9",
        "Referer": "https://mobgsm.com/",
      }, // Disable caching for real-time data
    })
    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getReloadlyAirtime(): Promise<reloadly[]> {

  try {
    const response = await fetch(`https://mobgsm.com/api/reloadly_airtime`, {
      cache: "force-cache",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9",
        "Referer": "https://mobgsm.com/",
      }, // Disable caching for real-time data
    })
    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}


export async function getReloadlyGifts(): Promise<reloadly[]> {

  try {
    const response = await fetch(`https://mobgsm.com/api/reloadly_giftcards`, {
      cache: "force-cache",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9",
        "Referer": "https://mobgsm.com/",
      }, // Disable caching for real-time data
    })
    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getDevices(): Promise<Device[]> {

  try {
    const response = await fetch(`https://mobgsm.com/api/devices`, {
      cache: "force-cache",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9",
        "Referer": "https://mobgsm.com/",
      }, // Disable caching for real-time data
    })

    console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}