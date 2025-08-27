import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await rapydRequest("POST", "/v1/ewallets/transfers/response", body)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Set transfer response error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to set transfer response" },
      { status: 500 },
    )
  }
}
