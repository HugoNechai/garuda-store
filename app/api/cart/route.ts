import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { productId, quantity } = body;

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID required" },
      { status: 400 }
    );
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      productId: Number(productId),
      quantity: quantity ? Number(quantity) : 1,
    },
  });

  return NextResponse.json(cartItem);
}