import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
export async function GET(request: NextRequest) {

  const supabase = createClient()
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    
    const { data, error } = await supabase
  .from("Users")
  .select("credit, debit")
  .eq("email", email)
  .single();



    console.log("Balance data:", data)

    if (error) {
      console.error("Fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Topup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
