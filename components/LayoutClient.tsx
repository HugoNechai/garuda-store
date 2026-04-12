"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CartProvider } from "@/components/CartContext";
import CartIcon from "@/components/CartIcon";
import CartDrawer from "@/components/CartDrawer";

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

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]);

  return (
    <CartProvider>
      {/* HEADER */}
      <header className="select-none w-full text-white border-b border-white/10 bg-navy/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo-new.png"
              alt="Garuda"
              className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            <Link
              href="/about"
              className="text-sm text-white/70 hover:text-white transition"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-sm text-white/70 hover:text-white transition"
            >
              Contact
            </Link>

            {user ? (
              <Link
                href="/account"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Login
              </Link>
            )}

            {!hideCart && <CartIcon />}
          </div>

        </div>
      </header>

      {children}

      {!hideCart && <CartDrawer />}
    </CartProvider>
  );
}