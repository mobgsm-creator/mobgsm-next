// app/api/stripe/createPayment/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { redis } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";
const createRateLimit = ( ) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(3, "3 m"),
    analytics: true,
  });
};
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency } = body;
    console.log(amount, currency);
    const ratelimit = createRateLimit();
    const ip = 
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
  req.headers.get("x-real-ip") || 
  "anonymous";
  


    // Rate limit check if paid
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Try again or Consider purchasing credits to increase rate limits.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }


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
