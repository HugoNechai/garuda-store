"use client";

import { useCart } from "./CartContext";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { cartCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative text-white/70 hover:text-white transition"
    >
      {/* ICON */}
      <ShoppingCart size={20} />

      {/* BADGE */}
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] font-medium text-white">
          {cartCount}
        </span>
      )}
    </button>
  );
}