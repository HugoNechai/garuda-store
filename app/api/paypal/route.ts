import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const orderId = formData.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID missing" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const accessTokenRes = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const accessTokenData = await accessTokenRes.json();
  const accessToken = accessTokenData.access_token;

  const orderRes = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: (order.total / 100).toFixed(2),
            },
            custom_id: order.id.toString(),
          },
        ],
        application_context: {
          return_url: `http://localhost:3000/success?orderId=${orderId}`,
          cancel_url: "http://localhost:3000/cart",
        },
      }),
    }
  );

  const orderData = await orderRes.json();

  const approveLink = orderData.links.find(
    (link: any) => link.rel === "approve"
  )?.href;

  if (!approveLink) {
    return NextResponse.json(
      { error: "PayPal approve link missing" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(approveLink);
}