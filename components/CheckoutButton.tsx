"use client";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    window.location.href = data.url;
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition"
    >
      Checkout
    </button>
  );
}