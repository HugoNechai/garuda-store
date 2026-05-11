import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { Product, ProductImage } from "@prisma/client";

type ProductWithImages = Product & {
  images: ProductImage[];
};

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-500"
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              garuda shuttlecocks
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
              Products
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45 mt-5">
              Explore Collection & Performance Below
            </p>
          </div>

          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back to home
          </Link>
        </div>

        {/* PRODUCTS GRID */}
        <div className="mb-24 md:mb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
            {products.map((product: ProductWithImages) => (
              <div key={product.id} className="max-w-[340px] mx-auto w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* COMPARISON HEADER */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
            Comparison
          </p>

          <h2 className="text-2xl md:text-3xl font-medium tracking-tight max-w-2xl">
            Compare performance across key characteristics
          </h2>
        </div>

        {/* COMPARISON CARDS */}
        <div className="grid md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
          {[
            {
              name: "Garuda Silver",
              stats: [7, 8, 8, 9, 9, 8],
            },
            {
              name: "Garuda Gold",
              stats: [9, 9, 8, 9, 10, 9],
            },
            {
              name: "Garuda Wings",
              stats: [10, 10, 8, 8, 8, 9],
            },
          ].map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                {p.name}
              </p>

              <div className="space-y-4 text-sm text-white/80">
                {[
                  "Durability",
                  "Appearance",
                  "Spin",
                  "Flight",
                  "Hit feeling",
                  "Overall",
                ].map((label, i) => (
                  <div key={label}>
                    <p className="mb-1">{label}</p>
                    <Bar value={p.stats[i]} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}