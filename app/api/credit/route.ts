import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
export const runtime = 'edge';
export const revalidate = 72000
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, email } = body;

    if (!amount || !currency || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Fetch existing credit
    const { data: user, error: fetchError } = await supabase
      .from("Users")
      .select("credit")
      .eq("email", email)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch user credit" },
        { status: 500 }
      );
    }

    let updatedCredit: { amount: number; currency: string }[] = [];

    if (!user?.credit) {
      // Case 1: No credit yet → create new array
      updatedCredit = [{ amount, currency }];
    } else {
      // Case 2: Credit exists → update or add
      updatedCredit = [...user.credit];
      const index = updatedCredit.findIndex(
        (entry) => entry.currency === currency
      );

      if (index >= 0) {
        // currency exists → add amount
        updatedCredit[index].amount += amount;
      } else {
        // new currency → push new object
        updatedCredit.push({ amount, currency });
      }
    }

    // Update in DB
    const { data, error } = await supabase
      .from("Users")
      .update({ credit: updatedCredit })
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { message: "Failed to update credit" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

