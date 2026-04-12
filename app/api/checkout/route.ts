import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const formData = await req.formData();
  const orderId = formData.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID missing" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.price,
      },
    }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: order.email ?? undefined,
    metadata: {
      orderId: order.id.toString(),
    },
    line_items,
    success_url:
      "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/payment?orderId=" + order.id,
  });

  return NextResponse.json({ url: session.url });
}