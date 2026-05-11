"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  decreaseCartItem: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const BOX_SIZE = 60;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        setIsLoggedIn(!!data.user);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!isLoggedIn) {
      setItems([]);
      return;
    }

    const loadCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        if (res.ok && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    };

    loadCart();
  }, [isLoggedIn, authChecked]);

  async function addToCart(
    item: Omit<CartItem, "quantity">,
    quantity: number = BOX_SIZE
  ) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);

      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { ...item, quantity }];
    });

    setIsOpen(true);

    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity,
          }),
        });
      } catch {}
    }
  }

  async function decreaseCartItem(productId: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - BOX_SIZE }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });
      } catch {}
    }
  }

  async function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));

    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            removeAll: true,
          }),
        });
      } catch {}
    }
  }

  function clearCart() {
    setItems([]);
    setIsOpen(false);
  }

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity / BOX_SIZE,
    0
  );

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        decreaseCartItem,
        removeFromCart,
        clearCart,
        cartCount,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}