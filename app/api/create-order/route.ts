import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type CartItemInput = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      city,
      postal,
      country,
      items,
    }: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      postal?: string;
      country?: string;
      items?: CartItemInput[];
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // ✅ ПРОВЕРКА STOCK (оставляем)
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // пользователь
    const user = email
      ? await prisma.user.findUnique({
          where: { email },
        })
      : null;

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // ✅ ТОЛЬКО СОЗДАЁМ ЗАКАЗ (без изменения stock)
    const order = await prisma.order.create({
      data: {
        total,
        name,
        email,
        phone,
        address,
        city,
        postal,
        country,
        userId: user?.id || null,
        status: "pending",

        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      redirect: `/payment?orderId=${order.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}