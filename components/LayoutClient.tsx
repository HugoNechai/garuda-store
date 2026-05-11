"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CartProvider } from "@/components/CartContext";
import CartIcon from "@/components/CartIcon";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

type User = {
  id: number;
  email: string;
  name?: string;
};

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const hideCart =
    pathname.startsWith("/payment") ||
    pathname.startsWith("/success");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(res.ok ? data.user : null);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]);

  return (
    <CartProvider>

      {/* NAV */}
      <div className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between text-white">

          <Link href="/">
            <img
              src="/logo-new.png"
              alt="Garuda"
              className="h-10 md:h-12 brightness-0 invert"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-white/70 hover:text-white transition">
              About
            </Link>

            <Link href="/contact" className="text-sm text-white/70 hover:text-white transition">
              Contact
            </Link>

            {user ? (
              <Link href="/account" className="text-sm text-white/70 hover:text-white transition">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm text-white/70 hover:text-white transition">
                Sign In
              </Link>
            )}

            {!hideCart && <CartIcon />}
          </div>

        </div>
      </div>

      {/* PAGE */}
      {children}

      {/* FOOTER */}
      <Footer />

      {!hideCart && <CartDrawer />}
    </CartProvider>
  );
}