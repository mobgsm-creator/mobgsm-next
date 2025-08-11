import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
export const runtime = 'edge';
export const revalidate = 72000
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { first_name, last_name, mobile, email, country } = body

    if (!first_name || !last_name || !mobile || !email || !country) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }
    console.log("here is the form data:", body)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("form_data")
      .insert([{ first_name, last_name, mobile, email, country }])
      .select()
      .single()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ message: "Failed to save form data" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
