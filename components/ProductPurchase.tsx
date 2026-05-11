"use client";

import { useCart } from "@/components/CartContext";
import AddToCartButton from "@/components/AddToCartButton";
import { useState } from "react";

const BOX_SIZE = 60;

export default function ProductPurchase({
  productId,
  name,
  price,
  stock,
}: {
  productId: number;
  name: string;
  price: number;
  stock: number;
}) {
  const { items } = useCart();

  const currentItem = items.find((i) => i.productId === productId);
  const alreadyInCart = currentItem ? currentItem.quantity : 0;

  const availableStock = stock - alreadyInCart;
  const boxesAvailable = Math.floor(availableStock / BOX_SIZE);
  const isAvailable = boxesAvailable >= 1;

  const [boxes, setBoxes] = useState(1);

  const decrease = () => {
    if (boxes > 1) setBoxes((prev) => prev - 1);
  };

  const increase = () => {
    if (boxes < boxesAvailable) setBoxes((prev) => prev + 1);
  };

  return (
    <>
      {isAvailable ? (
        <p className="text-sm text-white/55 mb-4">In stock</p>
      ) : (
        <p className="text-sm text-red-300 mb-4">Out of stock</p>
      )}

      {isAvailable && (
        <div className="flex items-center gap-4 mb-5">
          {/* MINUS */}
          <button
            type="button"
            onClick={decrease}
            disabled={boxes <= 1}
            className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-navy disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            −
          </button>

          <p className="min-w-16 text-center text-sm text-white/80">
            {boxes} box{boxes > 1 ? "es" : ""}
          </p>

          {/* PLUS */}
          <button
            type="button"
            onClick={increase}
            disabled={boxes >= boxesAvailable}
            className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-navy disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            +
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        {isAvailable ? (
          <AddToCartButton
            productId={productId}
            name={name}
            price={price}
            stock={stock}
            quantity={boxes * BOX_SIZE}
          />
        ) : (
          <button
            disabled
            className="rounded-full border border-white/10 bg-white/10 text-white/40 px-8 py-3 text-sm font-medium cursor-not-allowed"
          >
            Out of stock
          </button>
        )}
      </div>
    </>
  );
}