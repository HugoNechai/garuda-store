import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { Product, ProductImage } from "@prisma/client";

type ProductWithImages = Product & {
  images: ProductImage[];
};

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-black transition-all duration-500"
        style={{ width: `${value * 10}%` }}
      />
    </div>
  );
}

export default async function ProductsPage() {
  const products: ProductWithImages[] = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  return (
    <main className="min-h-[calc(100svh-80px)] bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">
              Store
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
              Products
            </h1>
          </div>

          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Back to home
          </Link>
        </div>

        {/* PRODUCTS GRID */}
        <div className="mb-2">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product: ProductWithImages) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* SCROLL HINT */}
        <div className="flex justify-center mt-0 mb-10">
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-xs tracking-wide">Explore more</span>
            <span className="text-lg leading-none">↓</span>
          </div>
        </div>

        {/* COMPARISON HEADER (чуть виден сразу) */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">
            Comparison
          </p>

          <h2 className="text-2xl md:text-3xl font-medium tracking-tight max-w-2xl">
            Compare performance across key characteristics
          </h2>
        </div>

        {/* COMPARISON CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">

          {/* DOUBLE WING */}
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
              Double Wing
            </p>

            <div className="space-y-4 text-sm">
              <div><p className="mb-1">Durability</p><Bar value={10} /></div>
              <div><p className="mb-1">Appearance</p><Bar value={10} /></div>
              <div><p className="mb-1">Spin</p><Bar value={8} /></div>
              <div><p className="mb-1">Flight</p><Bar value={8} /></div>
              <div><p className="mb-1">Hit feeling</p><Bar value={8} /></div>
              <div><p className="mb-1">Overall</p><Bar value={9} /></div>
            </div>
          </div>

          {/* GOLD */}
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
              Gold
            </p>

            <div className="space-y-4 text-sm">
              <div><p className="mb-1">Durability</p><Bar value={9} /></div>
              <div><p className="mb-1">Appearance</p><Bar value={9} /></div>
              <div><p className="mb-1">Spin</p><Bar value={8} /></div>
              <div><p className="mb-1">Flight</p><Bar value={9} /></div>
              <div><p className="mb-1">Hit feeling</p><Bar value={10} /></div>
              <div><p className="mb-1">Overall</p><Bar value={9} /></div>
            </div>
          </div>

          {/* SILVER */}
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
              Silver
            </p>

            <div className="space-y-4 text-sm">
              <div><p className="mb-1">Durability</p><Bar value={7} /></div>
              <div><p className="mb-1">Appearance</p><Bar value={8} /></div>
              <div><p className="mb-1">Spin</p><Bar value={8} /></div>
              <div><p className="mb-1">Flight</p><Bar value={9} /></div>
              <div><p className="mb-1">Hit feeling</p><Bar value={9} /></div>
              <div><p className="mb-1">Overall</p><Bar value={8} /></div>
            </div>
          </div>

        </div>

      </section>
    </main>
  );
}