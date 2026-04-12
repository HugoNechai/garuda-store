import Link from "next/link";

export default function Home() {
  return (
    <main className="relative h-[calc(100svh-80px)] overflow-hidden bg-navy text-white select-none">

      {/* subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto h-full px-6 pt-24 pb-10 flex flex-col">

        {/* HERO */}
        <div className="flex flex-col items-center text-center mb-20">

          <p className="text-xs tracking-[0.35em] uppercase text-white/60 mb-8">
            Crafted in Indonesia
          </p>

          <h1 className="text-7xl md:text-[110px] font-medium tracking-[-0.03em] leading-none">
            Garuda
          </h1>

        </div>

        {/* CARD */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 md:px-12 md:py-14 text-center">

            <p className="text-xs uppercase tracking-[0.35em] text-white/50 mb-6">
              Craftsmanship
            </p>

            <h2 className="text-2xl md:text-4xl font-normal text-white tracking-tight leading-relaxed mb-10">
              Shuttlecocks made from natural feathers, built for reliable play.
            </h2>

            <Link
              href="/products"
              className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.98]"
            >
              View Products
            </Link>

          </div>
        </div>

      </section>
    </main>
  );
}