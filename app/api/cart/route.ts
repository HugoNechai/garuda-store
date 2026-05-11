import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BOX_SIZE = 60;

// GET — получить корзину
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        product: true,
      },
    });

    const formatted = cartItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    return NextResponse.json({ items: formatted });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// POST — добавить в корзину
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({
        success: true,
        guest: true,
      });
    }

    const numericProductId = Number(productId);
    const numericQuantity = quantity ? Number(quantity) : BOX_SIZE;
    const numericUserId = Number(userId);

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: numericUserId,
        productId: numericProductId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + numericQuantity,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          productId: numericProductId,
          quantity: numericQuantity,
          userId: numericUserId,
        },
      });
    }

    return NextResponse.json({ success: true, cartItem });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE — уменьшить на 1 box ИЛИ удалить полностью
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { productId, removeAll } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ success: true });
    }

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: Number(userId),
        productId: Number(productId),
      },
    });

    if (!existing) {
      return NextResponse.json({ success: true });
    }

    // FULL REMOVE
    if (removeAll) {
      await prisma.cartItem.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({ success: true });
    }

    // NORMAL DECREASE
    if (existing.quantity > BOX_SIZE) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity - BOX_SIZE,
        },
      });
    } else {
      await prisma.cartItem.delete({
        where: { id: existing.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}