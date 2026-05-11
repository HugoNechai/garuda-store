"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
};

type Order = {
  id: number;
  total: number;
  items: OrderItem[];
};

type GroupedItem = {
  name: string;
  quantity: number;
  totalPrice: number;
};

export default function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`);
        const data = await res.json();

        if (!res.ok) {
          setOrder(null);
        } else {
          setOrder(data);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const groupedItems = useMemo<GroupedItem[]>(() => {
    if (!order?.items) return [];

    const map = new Map<string, GroupedItem>();

    for (const item of order.items) {
      const key = item.product.name;
      const existing = map.get(key);

      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice += item.price * item.quantity;
      } else {
        map.set(key, {
          name: item.product.name,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        });
      }
    }

    return Array.from(map.values());
  }, [order]);

  if (!orderId) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

        <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
          <h1 className="text-3xl font-medium tracking-tight">
            Order not found
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Checkout
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-5">
              Payment Method
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Choose Payment & Review Your Order
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            {/* PAYMENT */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-6">
                Payment
              </p>

              <div className="space-y-4">
                <button
                  onClick={async () => {
                    const formData = new FormData();
                    formData.append("orderId", orderId);

                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      body: formData,
                    });

                    const data = await res.json();

                    if (!res.ok) {
                      alert(data.error || "Payment error");
                      return;
                    }

                    if (data.url) {
                      window.location.href = data.url;
                    }
                  }}
                  className="w-full rounded-full border border-white bg-white text-navy py-3 text-sm font-medium transition hover:opacity-90 active:scale-[0.98]"
                >
                  Pay with Card
                </button>

                <form action="/api/paypal" method="POST">
                  <input type="hidden" name="orderId" value={orderId} />

                  <button
                    type="submit"
                    className="w-full rounded-full border border-white/40 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-navy active:scale-[0.98]"
                  >
                    Pay with PayPal
                  </button>
                </form>
              </div>
            </div>

            {/* ORDER */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-6">
                Order
              </p>

              {loading ? (
                <p className="text-sm text-white/60">Loading...</p>
              ) : !order || !order.items ? (
                <p className="text-sm text-red-300">Failed to load order</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {groupedItems.map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.name}
                            </p>

                            <p className="text-sm text-white/60 mt-2">
                              €{(item.totalPrice / item.quantity / 100).toFixed(2)} ×{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="text-sm font-medium text-white">
                            €{(item.totalPrice / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-between text-sm">
                    <span className="text-white/60">Total</span>
                    <span className="text-base font-medium text-white">
                      €{(order.total / 100).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}