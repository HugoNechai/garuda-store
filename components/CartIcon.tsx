"use client";

import { useCart } from "./CartContext";

export default function CartIcon() {
  const { cartCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative text-sm font-medium hover:opacity-70 transition"
    >
      Cart

      {cartCount > 0 && (
        <span className="ml-2 text-gray-500">
          ({cartCount})
        </span>
      )}
    </button>
  );
}