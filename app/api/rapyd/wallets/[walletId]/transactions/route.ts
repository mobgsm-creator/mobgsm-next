import { type NextRequest, NextResponse } from "next/server"
import { rapydRequest } from "@/lib/rapyd"

export async function GET(request: NextRequest, { params }: { params: { walletId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const page_size = searchParams.get("page_size") || "10"

    const queryParams = new URLSearchParams({
      page,
      page_size,
    })

    const data = await rapydRequest("GET", `/v1/ewallets/${params.walletId}/transactions?${queryParams}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("List wallet transactions error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list wallet transactions" },
      { status: 500 },
    )
  }
}
