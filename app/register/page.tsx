"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push(redirectTo);
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
              Create Account
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Join the Garuda Community
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <div className="max-w-5xl mx-auto">
          <div className="max-w-[68rem] rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
                />

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

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              {error && (
                <p className="text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-white bg-transparent text-white py-3 text-sm font-medium transition hover:bg-white hover:text-navy active:scale-[0.99] disabled:opacity-40"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}