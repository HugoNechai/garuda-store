import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white select-none">

      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col">

        {/* HERO */}
        <div className="flex flex-col items-center text-center mb-24 mt-16">

          <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-6">
            Crafted in Indonesia
          </p>

          {/* MAIN TITLE */}
          <h1 className="text-5xl md:text-[90px] font-medium tracking-[-0.03em] leading-none">
            Garuda{" "}Shuttlecocks
          </h1>

          {/* SLOGAN */}
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/70">
            Own the Air
          </p>

        </div>

        {/* BRAND CARD */}
        <div className="flex justify-center mb-32">
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 md:px-12 md:py-14 text-center">

            <h2 className="text-2xl md:text-4xl font-normal text-white tracking-tight leading-relaxed mb-8">
              Natural feather shuttlecocks designed for consistent flight and lasting durability
            </h2>

            <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-8">
                  Explore the Collection Below
            </p>

            <a
              href="/products"
              className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.98]"
            >
              View Products
            </a>

          </div>
        </div>

        {/* PRODUCTS */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">

          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              {/* IMAGE */}
              <div className="aspect-square bg-white/5 flex items-center justify-center">
                {product.images[0] ? (
                  <img
                    src={product.images[0].imageUrl}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="text-xs text-white/30">No image</div>
                )}
              </div>

              {/* TEXT */}
              <div className="p-5 text-center">
                <p className="text-sm text-white/80">
                  {product.name}
                </p>

                <p className="text-xs text-white/50 mt-1">
                  {product.slogan}
                </p>
              </div>
            </div>
          ))}

        </div>

      </section>
    </main>
  );
}