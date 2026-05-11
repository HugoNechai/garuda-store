import { resend } from "./resend";

type SendOrderConfirmationParams = {
  to: string;
  name: string;
  orderId: number;
  total: number;
};

export async function sendOrderConfirmation({
  to,
  name,
  orderId,
  total,
}: SendOrderConfirmationParams) {
  await resend.emails.send({
    from: "Garuda <onboarding@resend.dev>",
    to,
    subject: `Order Confirmation #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for your order, ${name}</h2>
        <p>Your payment was successfully received.</p>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Total:</strong> €${(total / 100).toFixed(2)}</p>
        <p>You can view your order anytime in your account dashboard.</p>
      </div>
    `,
  });
}