import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest, type CreateWalletRequest } from "@/lib/rapyd"

export async function POST(request: NextRequest) {
  try {
    const body: CreateWalletRequest = await request.json()

    const data = await rapydRequest("POST", "/v1/ewallets", body)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Create wallet error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create wallet" },
      { status: 500 },
    )
  }
}
