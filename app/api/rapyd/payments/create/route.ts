import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest, type PaymentRequest } from "@/lib/rapyd"

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()

    const data = await rapydRequest("POST", "/v1/payments", body)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Create payment error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment" },
      { status: 500 },
    )
  }
}
