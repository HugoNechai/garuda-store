import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Garuda",
    template: "%s — Garuda",
  },
  description: "Feather shuttlecocks built for consistent and reliable play",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.className} antialiased bg-white text-black`}
      >
        <LayoutClient>{children}</LayoutClient>

        {/* GOOGLE MAPS */}
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
        />
      </body>
    </html>
  );
}