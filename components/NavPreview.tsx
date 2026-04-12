"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NavPreview({
  type,
  onEnter,
  onLeave,
}: {
  type: "about" | "contact";
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="fixed inset-0 z-50"
      >

        {/* BACKDROP */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl" />

        {/* CONTENT */}
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">

          {type === "about" && (
            <div className="max-w-3xl space-y-8">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                About
              </p>

              <h1 className="text-5xl font-medium tracking-tight">
                Garuda
              </h1>

              <p className="text-gray-600 leading-relaxed text-lg">
                Garuda shuttlecocks are proudly made in Indonesia. The focus is on
                natural feather shuttlecocks and on keeping the product reliable in
                regular use.
              </p>

              <p className="text-gray-600 leading-relaxed text-lg">
                Production is handled in a setting where this type of work is
                already established. This allows the process to remain direct,
                controlled, and consistent.
              </p>

              <Link
                href="/about"
                className="inline-block text-sm underline underline-offset-4 hover:opacity-70"
              >
                Open full page
              </Link>

            </div>
          )}

          {type === "contact" && (
            <div className="max-w-3xl space-y-8">

              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Contact
              </p>

              <h1 className="text-5xl font-medium tracking-tight">
                Get in touch
              </h1>

              <p className="text-gray-600 text-lg">
                For questions, collaboration inquiries, or general information,
                you can reach out using the contact details below.
              </p>

              <div className="space-y-2 pt-4">
                <p className="text-xs text-gray-400 uppercase">
                  Email
                </p>

                <p className="text-lg font-medium">
                  contact@yourdomain.com
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-block text-sm underline underline-offset-4 hover:opacity-70 pt-4"
              >
                Open contact page
              </Link>

            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}