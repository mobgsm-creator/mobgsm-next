import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  //console.log("here inside GET operator data")
  try {
    const { searchParams } = new URL(request.url)
    const operatorId = searchParams.get("operatorId")

    //console.log("operatorId:", operatorId)

    // Validate required field
    if (!operatorId) {
      return NextResponse.json(
        { error: "Missing required field: operatorId" },
        { status: 400 }
      )
    }

    // Get token from environment variables
    const token = process.env.RELOADLY_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: "RELOADLY_TOKEN environment variable not configured" },
        { status: 500 }
      )
    }

    // Make request to Reloadly API
    const response = await fetch(`https://topups.reloadly.com/operators/${operatorId}`, {
      method: "GET",
      headers: {
        Accept: "application/com.reloadly.topups-v1+json",
        Authorization: `Bearer ${token}`,
      },
    })

    //console.log("Response status:", response.status)

    let data = null
    try {
      const text = await response.text()
      
      data = text ? JSON.parse(text) : null
     
    } catch (err) {
      console.error("Failed to parse JSON:", err)
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Reloadly API error", details: data },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Topup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
