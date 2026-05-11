"use client";

import { useCart } from "@/components/CartContext";

export default function AddToCartButton({
  productId,
  name,
  price,
  stock,
  quantity = 60,
}: {
  productId: number;
  name: string;
  price: number;
  stock: number;
  quantity?: number;
}) {
  const { addToCart, items } = useCart();

  const handleAdd = () => {
    const currentItem = items.find((i) => i.productId === productId);
    const currentQty = currentItem ? currentItem.quantity : 0;

    if (currentQty + quantity > stock) {
      alert("Not enough stock");
      return;
    }

    addToCart(
      {
        productId,
        name,
        price,
      },
      quantity
    );
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