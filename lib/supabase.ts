import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Product, BNPLProvider, ESIMProvider, reloadly } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side function to get products
  export async function getProducts(country: string): Promise<Product[]> {
    console.log("Fetching products from Supabase...")

    try {
      const response = await fetch(`/listings/api/products?country=${country}`, {
      cache: "force-cache", 
    })
    //console.log(response)

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
    const response = await fetch(`/listings/api/BNPL`, {
      cache: "force-cache", // Disable caching for real-time data
    })

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

  try {
    const response = await fetch(`/listings/api/ESIM`, {
      cache: "force-cache", // Disable caching for real-time data
    })
    //console.log(response)

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
    const response = await fetch(`/listings/api/reloadly_airtime`, {
      cache: "force-cache", // Disable caching for real-time data
    })
    //console.log(response)

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
    const response = await fetch(`/listings/api/reloadly_giftcards`, {
      cache: "force-cache", // Disable caching for real-time data
    })
    //console.log(response)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}