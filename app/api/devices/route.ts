import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
export const runtime = 'edge';
export const revalidate = 72000 // cache for 1 hour (optional for static rendering in RSC)

export async function GET() {
  try {

    const supabase = createClient();
    const { data, error } = await supabase
      .from('devices')
      .select('id, name_url,image, name, brand_name').range(0,1999)
  
    
    
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    const response = NextResponse.json(data || [])

    // ✅ Set HTTP cache headers
    //response.headers.set("Cache-Control", "public, s-maxage=76000, stale-while-revalidate=60")
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    return response
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


