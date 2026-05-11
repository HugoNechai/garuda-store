import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Product, ProductImage } from "@prisma/client";
import ProductPurchase from "@/components/ProductPurchase";

type ProductWithImages = Product & {
  images: ProductImage[];
};

const statsMap: Record<string, number[]> = {
  "Garuda Silver": [7, 8, 8, 9, 9, 8],
  "Garuda Gold": [9, 9, 8, 9, 10, 9],
  "Garuda Wings": [10, 10, 8, 8, 8, 9],
};

const statLabels = [
  "Durability",
  "Appearance",
  "Spin",
  "Flight",
  "Hit feeling",
  "Overall",
];

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

  const boxPrice = (product.price * 60) / 100;
  const stats = statsMap[product.name] || [8, 8, 8, 8, 8, 8];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff]">
      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8 text-white">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Garuda Shuttlecocks
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-5">
              {product.name}
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Product Details & Performance Below
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back to products
          </Link>
        </div>

        {/* CONTENT */}
        <div className="mb-24 md:mb-32 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-stretch">
            {/* IMAGE */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 h-full text-white">
              {product.images[0] ? (
                <img
                  src={product.images[0].imageUrl}
                  alt=""
                  className="w-full aspect-square object-cover rounded-[1.5rem]"
                />
              ) : (
                <div className="aspect-square flex items-center justify-center rounded-[1.5rem] bg-white/5 text-sm text-white/30">
                  No image
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 h-full flex flex-col justify-between text-white">
              <div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                  {product.name}
                </h2>

                {product.description && (
                  <p className="text-base md:text-lg text-white/75 leading-relaxed mb-10 max-w-md">
                    {product.description}
                  </p>
                )}

                <p className="text-3xl font-semibold mb-2">
                  ${boxPrice.toFixed(2)} / box
                </p>

                <p className="text-sm text-white/50 mb-6">
                  60 tubes per box
                </p>
              </div>

              <ProductPurchase
                productId={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
              />
            </div>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
            Performance
          </p>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              {product.name}
            </p>

            <div className="space-y-4 text-sm text-white/80">
              {statLabels.map((label, index) => (
                <div key={label}>
                  <p className="mb-1">{label}</p>
                  <Bar value={stats[index]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}