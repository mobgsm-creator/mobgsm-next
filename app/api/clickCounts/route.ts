import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const runtime = "edge";
export const revalidate = 72000;

export async function POST(req: NextRequest) {
  try {
    const { button } = await req.json();
    if (!button) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .rpc("increment_button_click", { button_name: button });

    if (error) {
      console.error("Increment error:", error);
      return NextResponse.json({ message: "Failed to increment" }, { status: 500 });
    }

    return NextResponse.json({ count: data }, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
