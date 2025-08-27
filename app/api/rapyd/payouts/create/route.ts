import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest, type PayoutRequest } from "@/lib/rapyd"

export async function POST(request: NextRequest) {
  try {
    const body: PayoutRequest = await request.json()

    const data = await rapydRequest("POST", "/v1/payouts", body)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Create payout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payout" },
      { status: 500 },
    )
  }
}
