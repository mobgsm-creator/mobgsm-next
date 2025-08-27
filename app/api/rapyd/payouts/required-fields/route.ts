import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const payout_method_type = searchParams.get("payout_method_type")
    const beneficiary_country = searchParams.get("beneficiary_country")
    const payout_currency = searchParams.get("payout_currency")
    const sender_country = searchParams.get("sender_country")
    const sender_currency = searchParams.get("sender_currency")

    if (!payout_method_type || !beneficiary_country || !payout_currency) {
      return NextResponse.json(
        { error: "Missing required parameters: payout_method_type, beneficiary_country, payout_currency" },
        { status: 400 },
      )
    }

    const queryParams = new URLSearchParams({
      payout_method_type,
      beneficiary_country,
      payout_currency,
      ...(sender_country && { sender_country }),
      ...(sender_currency && { sender_currency }),
    })

    const data = await rapydRequest("GET", `/v1/payouts/details?${queryParams}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Get payout required fields error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get payout required fields" },
      { status: 500 },
    )
  }
}
