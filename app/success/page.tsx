import { prisma } from "@/lib/prisma";
import ClearCartClient from "@/components/ClearCartClient";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; token?: string; orderId?: string }>;
}) {
  const params = await searchParams;

  let orderId: string | null = null;

  // STRIPE
  if (params.session_id) {
    const session = await stripe.checkout.sessions.retrieve(params.session_id);
    orderId = session.metadata?.orderId ?? null;
  }

  // PAYPAL
  if (params.token && params.orderId) {
    const accessTokenRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const accessTokenData = await accessTokenRes.json();
    const accessToken = accessTokenData.access_token;

    await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${params.token}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    orderId = params.orderId;
  }

  let order = null;

  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });
  }

  // ✅ ГЛАВНОЕ — уменьшаем stock
  if (order && order.status !== "paid") {
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
        data: { status: "paid" },
      });
    });
  }

  return (
    <main className="h-[calc(100svh-80px)] overflow-hidden bg-white text-black">

      <ClearCartClient />

      <section className="max-w-6xl mx-auto h-full px-6 pt-16 pb-6 flex flex-col">

        <div className="mb-6">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">
            Checkout
          </p>

          <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
            Payment Successful
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm w-full">

            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-black text-white flex items-center justify-center text-lg">
              ✓
            </div>

            <p className="text-gray-600 text-lg mb-8">
              Thank you for your order.
            </p>

            <a
              href="/"
              className="inline-flex justify-center rounded-full border border-gray-300 px-6 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Back to Store
            </a>

          </div>
        </div>

      </section>
    </main>
  );
}