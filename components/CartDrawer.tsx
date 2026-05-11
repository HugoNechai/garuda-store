"use client";

import { useCart } from "./CartContext";
import { usePathname, useRouter } from "next/navigation";

const BOX_SIZE = 60;

export default function CartDrawer() {
  const {
    items,
    addToCart,
    decreaseCartItem,
    removeFromCart,
    isOpen,
    closeCart,
  } = useCart();

  const pathname = usePathname();
  const router = useRouter();

  const hiddenOnPage =
    pathname === "/payment" ||
    pathname === "/success";

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      closeCart();

      if (!res.ok || !data.user) {
        router.push("/login?redirect=/checkout");
        return;
      }

      router.push("/checkout");
    } catch {
      closeCart();
      router.push("/login?redirect=/checkout");
    }
  };

  if (!isOpen || hiddenOnPage) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* DRAWER */}
      <div className="absolute right-0 top-0 h-full w-[400px] border-l border-white/10 bg-white/5 backdrop-blur-xl text-white flex flex-col">
        <div className="flex flex-col h-full px-6 py-8">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-white/45">
              Cart
            </p>

            <button
              onClick={closeCart}
              className="text-sm text-white/60 hover:text-white transition"
            >
              Close
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 flex flex-col">
            {items.length === 0 ? (
              <div className="pt-4">
                <p className="text-sm text-white/60">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <>
                {/* ITEMS */}
                <div className="flex-1 overflow-auto space-y-3 pr-1">
                  {items.map((item) => {
                    const boxes = item.quantity / BOX_SIZE;

                    return (
                      <div
                        key={item.productId}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {item.name}
                            </p>

                            <p className="text-sm text-white/55 mt-1">
                              €{(item.price / 100).toFixed(2)} / tube
                            </p>

                            <p className="text-xs text-white/40 mt-1">
                              {boxes} box{boxes > 1 ? "es" : ""} ({item.quantity} tubes)
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-xs text-white/40 hover:text-red-300 transition"
                          >
                            Remove
                          </button>
                        </div>

                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-4 mt-5">
                          <button
                            type="button"
                            onClick={() => decreaseCartItem(item.productId)}
                            className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-navy active:scale-[0.98]"
                          >
                            −
                          </button>

                          <p className="min-w-16 text-center text-sm text-white/80">
                            {boxes} box{boxes > 1 ? "es" : ""}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                {
                                  productId: item.productId,
                                  name: item.name,
                                  price: item.price,
                                },
                                BOX_SIZE
                              )
                            }
                            className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-navy active:scale-[0.98]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/55">Total</span>
                    <span className="font-medium text-base text-white">
                      €{(total / 100).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="block w-full text-center rounded-full border border-white py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.98]"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}