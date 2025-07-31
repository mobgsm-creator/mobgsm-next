import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import type { ESIMPlan, ESIMProvider } from "@/lib/types"
export const runtime = 'edge';
export const revalidate = 3600 // cache for 1 hour (optional for static rendering in RSC)
function sanitizeESIM(raw: {
  provider: string;
  img_link: string;
  type: string | object;
  plans: string | object;
  country: string;
}): ESIMProvider {
  let parsedType: string[] = [];
  let parsedPlans: ESIMPlan[] = [];

  try {
    parsedType = typeof raw.type === "string" ? JSON.parse(raw.type) : raw.type;
  } catch (e) {
    console.error(`Failed to parse 'type' for ${raw.provider} (${raw.country}):`, raw.type);
    throw e;
  }

  try {
    parsedPlans = typeof raw.plans === "string" ? JSON.parse(raw.plans) : raw.plans;
  } catch (e) {
    console.error(`Failed to parse 'plans' for ${raw.provider} (${raw.country}):`, raw.plans);
    throw e;
  }

  return {
    provider: raw.provider,
    img_link: raw.img_link,
    type: parsedType,
    plans: parsedPlans,
    country: raw.country
  };
}


export async function GET() {
  try {
    
    const supabase = createClient()

    const { data: products, error } = await supabase
      .from("esim")
      .select(`
        provider,
        type,
        img_link,
        plans, country
      
       
      
      `)
     
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
    //console.log("Products fetched:", products.slice(0,30))
    const sanitizedProducts = products.map(product => sanitizeESIM(product));
    const response = NextResponse.json(sanitizedProducts || [])

    // ✅ Set HTTP cache headers
    //response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60")
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    return response
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
