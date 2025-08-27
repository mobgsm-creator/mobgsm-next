import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest, type TransferRequest } from "@/lib/rapyd"

export async function POST(request: NextRequest) {
  try {
    const body: TransferRequest = await request.json()

    const data = await rapydRequest("POST", "/v1/ewallets/transfers", body)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Transfer funds error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transfer funds" },
      { status: 500 },
    )
  }
}
