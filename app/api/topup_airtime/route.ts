import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract required fields from request body
    const {
      operatorId,
      amount,
      useLocalAmount = true,
      customIdentifier = "",
      recipientEmail,
      recipientPhone,
      senderPhone = {
		"countryCode": "AE",
		"number": "562923497"
	},
    } = body

    // Validate required fields
    if (!operatorId || !amount || !recipientPhone) {
      return NextResponse.json(
        { error: "Missing required fields: operatorId, amount, recipientPhone" },
        { status: 400 },
      )
    }

    // Get token from environment variables
    const token = process.env.RELOADLY_TOKEN
    if (!token) {
      return NextResponse.json({ error: "RELOADLY_TOKEN environment variable not configured" }, { status: 500 })
    }

    // Make request to Reloadly API
    const response = await fetch("https://topups-sandbox.reloadly.com/topups", {
      method: "POST",
      headers: {
        Accept: "application/com.reloadly.topups-v1+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operatorId,
        amount,
        useLocalAmount,
        customIdentifier,
        recipientEmail,
        recipientPhone,
        senderPhone,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: "Reloadly API error", details: data }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Topup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
