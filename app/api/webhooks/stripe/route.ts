import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/sendOrderConfirmation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // ✅ УСПЕШНАЯ ОПЛАТА
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "paid",
        },
      });
    });

    if (order.email) {
      await sendOrderConfirmation({
        to: order.email,
        name: order.name || "Customer",
        orderId: order.id,
        total: order.total,
      });
    }
  }

  // ❌ FAILED PAYMENT
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const orderId = intent.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: "failed" },
      });
    }
  }

  return NextResponse.json({ received: true });
}