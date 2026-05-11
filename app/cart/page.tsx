import { prisma } from "@/lib/prisma";
import CheckoutButton from "@/components/CheckoutButton";
import PayPalButton from "@/components/PayPalButton";
import { cookies } from "next/headers";

export default async function CartPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const cartItems = userId
    ? await prisma.cartItem.findMany({
        where: {
          userId: Number(userId),
        },
        include: {
          product: true,
        },
      })
    : [];

  const total = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <main className="relative min-h-screen pt-28 md:pt-32 overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-4xl mx-auto px-6 pb-20">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
            Cart
          </p>

          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white">
            Your Cart
          </h1>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-10 md:py-10 backdrop-blur-xl">
          <div className="space-y-6">
            {!userId ? (
              <p className="text-white/60 text-sm">
                Log in to view your saved cart.
              </p>
            ) : cartItems.length === 0 ? (
              <p className="text-white/60 text-sm">
                Your cart is empty.
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-white/10 pb-4"
                >
                  <div>
                    <h2 className="font-semibold text-white">
                      {item.product.name}
                    </h2>

                    <p className="text-white/55 text-sm mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-white">
                    €{((item.product.price * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          {userId && cartItems.length > 0 && (
            <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="text-xl font-bold text-white">
                Total: €{(total / 100).toFixed(2)}
              </div>

              <div className="flex flex-wrap gap-4">
                <CheckoutButton />
                <PayPalButton />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}