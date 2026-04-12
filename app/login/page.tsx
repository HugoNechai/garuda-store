"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

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

      router.push("/account");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <main className="relative h-[calc(100svh-80px)] overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto h-full px-6 pt-16 pb-6 flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Account
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white">
              Login
            </h1>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex items-start pt-4">
          <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-12 md:py-10 backdrop-blur-xl">
            <form onSubmit={handleLogin} className="w-full space-y-6">
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

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-white bg-transparent text-white py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.99] disabled:opacity-40"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}