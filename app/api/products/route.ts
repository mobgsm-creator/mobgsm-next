import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: products, error } = await supabase
      .from("shopclues")
      .select(`
        product_links,
        product_name,
        brand,
        price,
        mrp,
        discount,
        status,
        payment_options,
        rating,
      
        img_link
      `).range(0, 1999);
      
    


    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json(products || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
