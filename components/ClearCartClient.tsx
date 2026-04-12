"use client";

import { useEffect } from "react";

export default function ClearCartClient() {
  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return null;
}