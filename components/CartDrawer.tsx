"use client";

import { useCart } from "./CartContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CartDrawer() {
  const { items, removeFromCart, isOpen, closeCart } = useCart();
  const pathname = usePathname();

  const hiddenOnPage =
    pathname === "/payment" ||
    pathname === "/success";

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen || hiddenOnPage) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-navy/55 backdrop-blur-md"
        onClick={closeCart}
      />

      {/* DRAWER */}
      <div className="absolute right-0 top-0 h-full w-[400px] border-l border-white/10 bg-navy/95 px-6 py-8 text-white backdrop-blur-xl flex flex-col">
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

        {/* CONTENT */}
        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="pt-4">
              <p className="text-sm text-white/60">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              <div className="flex-1 overflow-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* LEFT */}
                      <div className="flex flex-col">
                        <p className="text-sm font-medium tracking-tight text-white">
                          {item.name}
                        </p>

                        <p className="text-sm text-white/55 mt-1">
                          €{(item.price / 100).toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs text-white/45 hover:text-white transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="pt-6 mt-6 border-t border-white/10 space-y-5">
                {/* TOTAL */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/55">Total</span>
                  <span className="font-medium text-base text-white">
                    €{(total / 100).toFixed(2)}
                  </span>
                </div>

                {/* CHECKOUT */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center rounded-full border border-white bg-transparent text-white py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.98]"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}