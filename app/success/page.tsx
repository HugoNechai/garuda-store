import { prisma } from "@/lib/prisma";
import ClearCartClient from "@/components/ClearCartClient";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    token?: string;
    orderId?: string;
  }>;
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
      where: {
        id: Number(orderId),
      },
      include: {
        items: true,
      },
    });
  }

  // уменьшаем stock
  if (order && order.status !== "paid") {
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "paid",
        },
      });
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      <ClearCartClient />

      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto min-h-screen px-6 pt-28 md:pt-32 pb-32 md:pb-40 flex flex-col">
        {/* HEADER */}
        <div className="mb-16 md:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-white/45 mb-4">
            Checkout
          </p>

          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-5">
            Payment Successful
          </h1>

          <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
            Your Order Has Been Confirmed
          </p>
        </div>

        {/* SUCCESS CARD */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 md:px-12 md:py-14 text-center">
            <h2 className="text-2xl md:text-4xl font-normal text-white tracking-tight leading-relaxed mb-8">
              Thank you for your order
            </h2>

            <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-8">
              We’ll prepare your shipment shortly
            </p>

            <a
              href="/"
              className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.98]"
            >
              Back to Store
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}