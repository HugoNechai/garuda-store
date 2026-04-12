"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  images: { imageUrl: string }[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <article className="rounded-[1.75rem] border border-gray-200/70 bg-white overflow-hidden transition duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        {/* IMAGE */}
        <div className="aspect-[1/1] bg-gray-50 flex items-center justify-center overflow-hidden relative">
          {!imageError && product.images[0] ? (
            <img
              src={product.images[0].imageUrl}
              alt=""
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="text-xs text-gray-300">No image</div>
          )}

          {/* subtle overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition" />
        </div>

        {/* CONTENT */}
        <div className="p-5">

          {/* NAME */}
          <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:underline">
            {product.name}
          </h3>

          {/* DESCRIPTION */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* PRICE + ACTION */}
          <div className="flex items-center justify-between">
            <span className="text-base font-medium">
              €{(product.price / 100).toFixed(2)}
            </span>

            <span className="text-sm text-gray-400 group-hover:text-black transition">
              View →
            </span>
          </div>

        </div>
      </article>
    </Link>
  );
}