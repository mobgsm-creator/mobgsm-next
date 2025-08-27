import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { country: string } }) {
  try {
    const data = await rapydRequest("GET", `/v1/payouts/supported_types?country=${params.country}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("List payout method types error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list payout method types" },
      { status: 500 },
    )
  }
}
