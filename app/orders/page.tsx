import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Orders
      </h1>

      <div className="space-y-10">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-6"
          >
            <div className="mb-4">
              <p className="font-bold">
                Order #{order.id}
              </p>
              <p className="text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>

                  <span>
                    €{((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 font-bold">
              Total: €{(order.total / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}