import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { walletId: string } }) {
  try {
    const data = await rapydRequest("GET", `/v1/ewallets/${params.walletId}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Retrieve wallet error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve wallet" },
      { status: 500 },
    )
  }
}
