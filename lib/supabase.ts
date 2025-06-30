import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Product, BNPLProvider, ESIMProvider } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side function to get products
export async function getProducts(): Promise<Product[]> {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products`, {
      cache: "no-store", // Disable caching for real-time data
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
export async function getBNPL(): Promise<BNPLProvider[]> {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/BNPL`, {
      cache: "no-store", // Disable caching for real-time data
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ESIM`, {
      cache: "no-store", // Disable caching for real-time data
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