import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract required fields from request body
    const {
      productId,
      quantity,
      unitPrice,
      productAdditionalRequirements= {
		"userId": "*"},
      senderName,
      customIdentifier = "",
      recipientEmail,
      recipientPhoneDetails,
      preOrder=false,
    } = body
    const req_body=JSON.stringify({
        productId,
        quantity,
        unitPrice, 
        customIdentifier,
        productAdditionalRequirements,
        senderName,
        recipientEmail,
        recipientPhoneDetails,
        preOrder,
      })
    //console.log(req_body)
    // Validate required fields
    if (!productId || !recipientPhoneDetails) {
      return NextResponse.json(
        { error: "Missing required fields: operatorId, amount, recipientPhone" },
        { status: 400 },
      )
    }

    // Get token from environment variables
    const token = process.env.GIFTCARD_TOKEN
    if (!token) {
      return NextResponse.json({ error: "RELOADLY_TOKEN environment variable not configured" }, { status: 500 })
    }

    // Make request to Reloadly API
    const response = await fetch("https://giftcards.reloadly.com/orders", {
      method: "POST",
      headers: {
        Accept: "application/com.reloadly.giftcards-v1+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: req_body ,
    })
    //console.log(response.status)
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: "Reloadly API error", details: data }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    //console.log(error)
    console.error("Topup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
