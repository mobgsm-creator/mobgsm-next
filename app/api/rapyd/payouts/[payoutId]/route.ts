import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { payoutId: string } }) {
  try {
    const data = await rapydRequest("GET", `/v1/payouts/${params.payoutId}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Retrieve payout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve payout" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { payoutId: string } }) {
  try {
    const data = await rapydRequest("DELETE", `/v1/payouts/${params.payoutId}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Cancel payout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel payout" },
      { status: 500 },
    )
  }
}
