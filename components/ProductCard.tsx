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
    <Link href={`/product/${product.id}`} className="group block h-full">
      <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition duration-500 hover:bg-white/[0.08]">
        {/* IMAGE */}
        <div className="aspect-[1/0.82] bg-white/5 flex items-center justify-center overflow-hidden relative">
          {!imageError && product.images[0] ? (
            <img
              src={product.images[0].imageUrl}
              alt=""
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="text-xs text-white/30">No image</div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.12] transition" />
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <h3 className="text-[15px] font-medium mb-1.5 text-white">
            {product.name}
          </h3>

          <p className="text-[11px] text-white/50 mb-2.5">
            Sold in boxes • 60 tubes
          </p>

          {product.description && (
            <p className="text-[13px] text-white/60 leading-[1.5] mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-white">
              ${(product.price / 100).toFixed(2)}
              <span className="text-[10px] text-white/50 ml-1">/ tube</span>
            </span>

            <span className="text-[12px] text-white/40 group-hover:text-white transition">
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}