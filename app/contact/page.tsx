import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen pt-28 md:pt-32 overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pb-32 md:pb-40">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Garuda Shuttlecocks
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-5">
              Contact
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Questions, Support & Partnerships
            </p>
          </div>

          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back to home
          </Link>
        </div>

        {/* STACK */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-8 max-w-[42rem]">
            {/* PARTNERSHIPS */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
                Partnerships
              </p>

              <p className="text-white/80 leading-relaxed text-[15px] md:text-base mb-6">
                Interested in working with us? We welcome select distribution and
                collaboration opportunities with partners who share our passion
                for badminton
              </p>

              <p className="font-medium text-white">
                Let’s grow the game together
              </p>
            </div>

            {/* EMAIL / PHONE */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
                Contact Details
              </p>

              <div className="space-y-3 mb-6">
                <p className="text-xl md:text-2xl font-medium">
                  contact@yourdomain.com
                </p>

                <p className="text-base md:text-lg text-white/75">
                  +1 (000) 000-0000
                </p>
              </div>

              <p className="text-white/60 leading-relaxed text-[15px] md:text-base">
                Reach out anytime — we aim to respond promptly to all inquiries
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}