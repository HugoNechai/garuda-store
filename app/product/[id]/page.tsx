import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Product, ProductImage } from "@prisma/client";
import AddToCartButton from "@/components/AddToCartButton";

type ProductWithImages = Product & {
  images: ProductImage[];
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product: ProductWithImages | null = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });

  if (!product) notFound();

  return (
    <main className="min-h-[calc(100svh-80px)] bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
            Product
          </p>

          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Back to products
          </Link>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* IMAGE */}
          <div className="rounded-[2rem] border border-gray-200/70 bg-gray-50/80 p-6">
            {product.images[0] ? (
              <img
                src={product.images[0].imageUrl}
                alt=""
                className="w-full aspect-square object-cover rounded-2xl"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* INFO CARD */}
          <div className="rounded-[1.75rem] border border-gray-200/70 bg-white p-8 md:p-10 h-fit">

            {/* TITLE */}
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              {product.name}
            </h1>

            {/* DESCRIPTION */}
            {product.description && (
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 max-w-md">
                {product.description}
              </p>
            )}

            {/* PRICE */}
            <p className="text-3xl font-semibold mb-4">
              €{(product.price / 100).toFixed(2)}
            </p>

            {/* STOCK STATUS */}
            {product.stock > 0 ? (
              <p className="text-sm text-gray-500 mb-8">
                In stock
              </p>
            ) : (
              <p className="text-sm text-red-500 mb-8">
                Out of stock
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center gap-4">
              {product.stock > 0 ? (
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  stock={product.stock} // ✅ ВАЖНО
                />
              ) : (
                <button
                  disabled
                  className="rounded-full bg-gray-200 text-gray-500 px-8 py-3 text-sm font-medium cursor-not-allowed"
                >
                  Out of stock
                </button>
              )}
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}