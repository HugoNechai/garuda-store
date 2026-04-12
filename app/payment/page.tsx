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

export default function PaymentPage() {
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
      <main className="h-[calc(100svh-80px)] flex items-center justify-center bg-white text-black">
        <h1 className="text-2xl font-medium">Order not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">
              Checkout
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
              Payment Method
            </h1>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Back
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* LEFT — PAYMENT */}
          <div className="rounded-[2rem] border border-gray-200/70 bg-gray-50/80 p-8 md:p-10">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
              Payment
            </p>

            <div className="space-y-4">

              {/* CARD */}
              <button
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("orderId", orderId!);

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
                className="w-full rounded-full bg-black text-white py-3 text-sm font-medium transition hover:opacity-80"
              >
                Pay with Card
              </button>

              {/* PAYPAL (сделали в стиле сайта) */}
              <form action="/api/paypal" method="POST">
                <input type="hidden" name="orderId" value={orderId!} />

                <button
                  type="submit"
                  className="w-full rounded-full border border-gray-300 py-3 text-sm font-medium hover:bg-gray-100 transition"
                >
                  Pay with PayPal
                </button>
              </form>

            </div>
          </div>

          {/* RIGHT — ORDER */}
          <div className="rounded-[2rem] border border-gray-200/70 bg-gray-50/80 p-8 md:p-10">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
              Order
            </p>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : !order || !order.items ? (
              <p className="text-sm text-red-500">Failed to load order</p>
            ) : (
              <>
                <div className="space-y-4">

                  {groupedItems.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-gray-200/70 bg-white px-4 py-4 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          €{(item.totalPrice / item.quantity / 100).toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium">
                        €{(item.totalPrice / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}

                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/70 flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>€{(order.total / 100).toFixed(2)}</span>
                </div>
              </>
            )}

          </div>

        </div>

      </section>
    </main>
  );
}