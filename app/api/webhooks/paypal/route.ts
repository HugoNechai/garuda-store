import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const eventType = body.event_type;

    // ✅ УСПЕШНАЯ ОПЛАТА
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = body.resource;

      // ⚠️ Важно: orderId нужно передавать в custom_id при создании PayPal заказа
      const orderId = capture?.custom_id;

      if (!orderId) {
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // защита от повторного webhook
      if (order.status === "paid") {
        return NextResponse.json({ received: true });
      }

      // 🔥 уменьшаем stock + обновляем статус
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: "paid" },
        });
      });
    }

    // ❌ ОШИБКА ОПЛАТЫ
    if (eventType === "PAYMENT.CAPTURE.DENIED") {
      const capture = body.resource;
      const orderId = capture?.custom_id;

      if (orderId) {
        await prisma.order.update({
          where: { id: Number(orderId) },
          data: { status: "failed" },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}