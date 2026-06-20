"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      try {
        const stored = localStorage.getItem("cart");

        if (stored) {
          const items = JSON.parse(stored);

          for (const item of items) {
            await fetch("/api/cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
              }),
            });
          }

          localStorage.removeItem("cart");
        }
      } catch {}

      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectTo);
      }

      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen pt-28 md:pt-32 overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pb-32 md:pb-40">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              GARUDA SHUTTLECOCKS
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-5">
              Login
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Access Your Account
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back to home
          </button>
        </div>

        {/* FORM */}
        <div className="max-w-5xl mx-auto">
          <div className="max-w-[68rem] rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              {error && (
                <p className="text-sm text-red-300">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-white bg-transparent text-white py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.99] disabled:opacity-40"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-sm text-white/50 text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
                  className="text-white hover:text-white/80 transition"
                >
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}