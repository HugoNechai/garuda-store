import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="relative min-h-[calc(100svh-80px)] overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Contact
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
            Get in touch for questions, collaboration, or general inquiries.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* CONTACT */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
              Contact
            </p>

            <p className="text-white/80 text-[15px] leading-relaxed">
              Reach out using the contact details below. We’re open to questions,
              partnerships, and general communication.
            </p>
          </div>

          {/* RESPONSE */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
              Response
            </p>

            <p className="text-white/80 text-[15px] leading-relaxed">
              Messages are reviewed as they come in, and a response is provided
              as soon as possible.
            </p>
          </div>

          {/* EMAIL */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-4">
              Email
            </p>

            <p className="text-lg font-medium text-white">
              contact@yourdomain.com
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}