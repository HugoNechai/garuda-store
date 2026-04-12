"use client";

import { useCart } from "@/components/CartContext";

export default function AddToCartButton({
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
  const { addToCart, items } = useCart();

  const handleAdd = async () => {
    const currentItem = items.find((i) => i.productId === productId);
    const currentQty = currentItem ? currentItem.quantity : 0;

    if (currentQty >= stock) {
      alert("Not enough stock");
      return;
    }

    addToCart({
      productId,
      name,
      price,
    });

    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="rounded-full border border-white bg-transparent px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-navy active:scale-[0.98]"
    >
      Add to Cart
    </button>
  );
}