"use client";

export default function PayPalButton() {
  const handlePayPal = async () => {
    const res = await fetch("/api/paypal", {
      method: "POST",
    });

    const data = await res.json();

    window.location.href = data.url;
  };

  return (
    <button
      onClick={handlePayPal}
      className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:opacity-80 transition"
    >
      Pay with PayPal
    </button>
  );
}