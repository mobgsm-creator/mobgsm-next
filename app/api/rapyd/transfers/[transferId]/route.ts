import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { transferId: string } }) {
  try {
    const data = await rapydRequest("GET", `/v1/ewallets/transfers/${params.transferId}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Retrieve transfer error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve transfer" },
      { status: 500 },
    )
  }
}
