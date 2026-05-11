"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

declare global {
  interface Window {
    google: any;
  }
}

type Form = {
  name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};

const CHECKOUT_STORAGE_KEY = "checkout_form";
const BOX_SIZE = 60;

export default function CheckoutPage() {
  const router = useRouter();

  const { items, addToCart, decreaseCartItem } = useCart();

  const addressRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    region: "",
    postal: "",
    country: "",
  });

  const [errors, setErrors] = useState<Partial<Form>>({});
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const validators = {
    name: (v: string) => v.trim().length >= 3 || "Enter your full name",
    email: (v: string) =>
      /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v) || "Enter a valid email",
    phone: (v: string) =>
      (!!v && v.length > 6) || "Enter a valid phone number",
    address: (v: string) =>
      v.trim().length >= 5 || "Enter a valid address",
    address2: () => true,
    city: (v: string) => v.trim().length >= 2 || "City is too short",
    region: () => true,
    postal: (v: string) =>
      /^[0-9A-Za-z\- ]{3,10}$/.test(v.trim()) || "Invalid postal code",
    country: (v: string) =>
      v.trim().length >= 2 || "Enter a country",
  };

  const validateField = (name: keyof Form, value: string) => {
    const result = validators[name](value);

    setErrors((prev) => ({
      ...prev,
      [name]: result === true ? undefined : result,
    }));
  };

  useEffect(() => {
    const initCheckout = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok || !data.user) {
          router.replace("/login?redirect=/checkout");
          return;
        }

        try {
          const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);

          if (saved) {
            const parsed = JSON.parse(saved) as Partial<Form>;

            setForm((prev) => ({
              ...prev,
              ...parsed,
              name: parsed.name || data.user.name || "",
              email: parsed.email || data.user.email || "",
            }));
          } else {
            setForm((prev) => ({
              ...prev,
              name: data.user.name || "",
              email: data.user.email || "",
            }));
          }
        } catch {
          setForm((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
          }));
        }
      } catch {
        router.replace("/login?redirect=/checkout");
      } finally {
        setIsLoaded(true);
      }
    };

    initCheckout();
  }, [router]);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form, isLoaded]);

  useEffect(() => {
    if (!window.google || !addressRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      addressRef.current,
      { types: ["address"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      const get = (type: string) =>
        place.address_components?.find((c: any) =>
          c.types.includes(type)
        )?.long_name || "";

      const newAddress = place.formatted_address || "";
      const newCity = get("locality");
      const newRegion = get("administrative_area_level_1");
      const newPostal = get("postal_code");
      const newCountry = get("country");

      setForm((prev) => ({
        ...prev,
        address: newAddress,
        city: newCity,
        region: newRegion,
        postal: newPostal,
        country: newCountry,
      }));

      validateField("address", newAddress);
      validateField("city", newCity);
      validateField("postal", newPostal);
      validateField("country", newCountry);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name as keyof Form, value);
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phone = value || "";

    setForm((prev) => ({
      ...prev,
      phone,
    }));

    validateField("phone", phone);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof Form, value);
  };

  const isValid =
    Object.values(errors).every((e) => !e) &&
    !!form.name &&
    !!form.email &&
    !!form.phone &&
    !!form.address &&
    !!form.city &&
    !!form.postal &&
    !!form.country &&
    items.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Object.entries(form).forEach(([key, value]) =>
      validateField(key as keyof Form, value)
    );

    if (!isValid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes("stock")) {
          alert("Some products are out of stock or not enough quantity");
        } else {
          alert(data.error || "Something went wrong");
        }

        setLoading(false);
        return;
      }

      window.location.href = data.redirect;
    } catch {
      alert("Network error");
      setLoading(false);
    }
  };

  const inputStyle = (field: keyof Form) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white text-black transition focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-red-400 focus:ring-red-400"
        : "border-white/10 focus:ring-white/40"
    }`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Checkout
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white">
              Payment
            </h1>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 hover:text-white transition"
          >
            Back
          </button>
        </div>

        {/* MATCHED PRODUCT PAGE CARD SIZING / WIDTH */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            {/* FORM CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="w-full space-y-5">
                <div className="space-y-4">
                  <div>
                    <input
                      name="name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputStyle("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-300 mt-2">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputStyle("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-300 mt-2">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <div
                      className={`rounded-xl border px-3 py-2 bg-white text-black transition ${
                        errors.phone ? "border-red-400" : "border-white/10"
                      }`}
                    >
                      <PhoneInput
                        international
                        defaultCountry="ID"
                        value={form.phone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-300 mt-2">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <input
                      ref={addressRef}
                      name="address"
                      placeholder="Address"
                      value={form.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputStyle("address")}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-300 mt-2">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="address2"
                      placeholder="Address line 2 (optional)"
                      value={form.address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputStyle("address2")}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle("city")}
                      />
                      {errors.city && (
                        <p className="text-xs text-red-300 mt-2">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <input
                        name="region"
                        placeholder="State / Region"
                        value={form.region}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle("region")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="postal"
                        placeholder="Postal code"
                        value={form.postal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle("postal")}
                      />
                      {errors.postal && (
                        <p className="text-xs text-red-300 mt-2">{errors.postal}</p>
                      )}
                    </div>

                    <div>
                      <input
                        name="country"
                        placeholder="Country"
                        value={form.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle("country")}
                      />
                      {errors.country && (
                        <p className="text-xs text-red-300 mt-2">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    disabled={!isValid || loading}
                    className="w-full rounded-full border border-white bg-white text-navy py-3.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-40"
                  >
                    {loading ? "Processing..." : "Continue to Payment"}
                  </button>
                </div>
              </form>
            </div>

            {/* ORDER CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 h-fit">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45 mb-5">
                Order
              </p>

              <div className="space-y-3">
                {items.map((item) => {
                  const boxes = item.quantity / BOX_SIZE;

                  return (
                    <div
                      key={item.productId}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white">
                            {item.name}
                          </p>

                          <p className="text-sm text-white/60">
                            €{(item.price / 100).toFixed(2)} / tube
                          </p>

                          <p className="text-xs text-white/45">
                            {boxes} box{boxes > 1 ? "es" : ""} (60 tubes each)
                          </p>
                        </div>

                        <span className="text-sm font-medium text-white">
                          €{((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-5">
                        <button
                          type="button"
                          onClick={() => decreaseCartItem(item.productId)}
                          className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-navy"
                        >
                          −
                        </button>

                        <p className="min-w-16 text-center text-sm text-white/80">
                          {boxes} box{boxes > 1 ? "es" : ""}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(
                              {
                                productId: item.productId,
                                name: item.name,
                                price: item.price,
                              },
                              BOX_SIZE
                            )
                          }
                          className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-navy"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {items.length > 0 && (
                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Total</span>
                    <span className="text-base font-medium text-white">
                      €
                      {(
                        items.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        ) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}