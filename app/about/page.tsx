import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen pt-28 md:pt-32 overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pb-32 md:pb-40">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Garuda Shuttlecocks
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-5">
              About
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Born in Indonesia — Played Worldwide
            </p>
          </div>

          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back to home
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* ORIGINS */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
            {/* TEXT */}
            <div className="order-2 md:order-1 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
                Origins
              </p>

              <p className="text-white/80 leading-relaxed text-[15px] md:text-base">
                We are a badminton shuttlecock brand based in Indonesia, a country
                where badminton is part of the culture and everyday life. We are
                driven by a passion for the sport and a commitment to supporting
                players at every level
              </p>
            </div>

            {/* IMAGE */}
            <div className="order-1 md:order-2 w-full">
              <div className="w-full aspect-square rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
                <span className="text-sm text-white/30">Image</span>
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
            {/* IMAGE */}
            <div className="w-full">
              <div className="w-full aspect-square rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
                <span className="text-sm text-white/30">Image</span>
              </div>
            </div>

            {/* TEXT */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
                Performance
              </p>

              <p className="text-white/80 leading-relaxed text-[15px] md:text-base">
                We create reliable shuttlecocks designed for consistent flight,
                durability, and performance. Our products are made with quality
                materials and tested to meet the needs of real games — from casual
                play to competitive matches
              </p>
            </div>
          </div>

          {/* PHILOSOPHY */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* TEXT */}
            <div className="order-2 md:order-1 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
                Philosophy
              </p>

              <p className="text-white/80 leading-relaxed text-[15px] md:text-base">
                Our mission is to make quality badminton equipment accessible to
                more players. We believe the right shuttlecock can improve the game
                experience and help players grow with confidence, one rally at a
                time
              </p>
            </div>

            {/* IMAGE */}
            <div className="order-1 md:order-2 w-full">
              <div className="w-full aspect-square rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
                <span className="text-sm text-white/30">Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}