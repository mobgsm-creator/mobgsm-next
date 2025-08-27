import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { country: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const currency = searchParams.get("currency")

    let urlPath = `/v1/payment_methods/countries/${params.country}`
    if (currency) {
      urlPath += `?currency=${currency}`
    }

    const data = await rapydRequest("GET", urlPath)

    return NextResponse.json(data)
  } catch (error) {
    console.error("List payment methods error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list payment methods" },
      { status: 500 },
    )
  }
}
