import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // Use the expected API version
});

export async function POST(req: NextRequest) {
  try {
    const { item } = await req.json();

    if (!item || !item.price || !item.title) {
      return NextResponse.json(
        { error: "Missing item details" },
        { status: 400 }
      );
    }

    // Ensure price is in cents
    const priceInCents = Math.round(item.price * 100);

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Or your desired currency
            product_data: {
              name: item.title,
              // You can add more product details like description or images here
              // description: item.description,
              // images: [item.image],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/marketplace/${item.id}?session_id={CHECKOUT_SESSION_ID}`, // Redirect back to item page on success
      cancel_url: `${req.nextUrl.origin}/marketplace/${item.id}`, // Redirect back to item page on cancellation
    });

    if (!session.url) {
      throw new Error("Stripe session URL not found");
    }

    // Return the session ID and URL to the client
    return NextResponse.json({ sessionId: session.id, url: session.url }); // Option 1: Return URL for client-side redirect

    // Option 2: Redirect server-side (often preferred) - Commented out to use client-side redirect
    // return NextResponse.redirect(session.url, 303);
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
