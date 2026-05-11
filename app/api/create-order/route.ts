import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get("userId")?.value;

    if (!userIdCookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(userIdCookie);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Validate box quantities
    for (const item of items) {
      if (item.quantity % 60 !== 0) {
        return NextResponse.json(
          { error: "Products must be ordered in boxes of 60 tubes" },
          { status: 400 }
        );
      }
    }

    // Validate stock
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

    // Calculate total server-side
    let total = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) continue;

      total += product.price * item.quantity;
    }

    // Create order
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
        userId: user.id,
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