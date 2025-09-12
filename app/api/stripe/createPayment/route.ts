// app/api/stripe/createPayment/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency } = body;
    console.log(amount, currency);



    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });
    console.log(paymentIntent);
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {//eslint-disable-line
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
