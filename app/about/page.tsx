import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="relative min-h-[calc(100svh-80px)] overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              About
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white">
              Garuda
            </h1>
          </div>

          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back
          </Link>
        </div>

        {/* HERO */}
        <div className="mb-20 max-w-4xl">
          <p className="text-2xl md:text-3xl leading-relaxed font-medium tracking-tight text-white">
            Garuda shuttlecocks are crafted in Indonesia with a focus on
            natural feathers and consistent, reliable performance.
          </p>
        </div>

        {/* GRID BLOCKS */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* PRODUCTION */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
              Production
            </p>

            <p className="text-white/80 leading-relaxed text-[15px]">
              Production is handled in an environment where this type of
              craftsmanship is already established. This allows every step to
              remain controlled, direct, and consistent.
            </p>
          </div>

          {/* QUALITY */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
              Quality
            </p>

            <p className="text-white/80 leading-relaxed text-[15px]">
              Each shuttlecock is made with attention to detail, ensuring stable
              flight and durability during regular play.
            </p>
          </div>

          {/* SHIPPING */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
              Shipping
            </p>

            <p className="text-white/80 leading-relaxed text-[15px]">
              Orders are shipped internationally. Delivery time and cost vary
              depending on destination, order size, and shipping method.
              Shipping is carried out by air or sea depending on logistics.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}