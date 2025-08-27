import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const data = await rapydRequest("GET", `/v1/payments/${params.paymentId}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Retrieve payment error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve payment" },
      { status: 500 },
    )
  }
}
