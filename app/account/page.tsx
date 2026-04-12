import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

function getStatusStyle(status: string) {
  switch (status) {
    case "paid":
      return "bg-black text-white";
    case "shipped":
      return "bg-gray-200 text-black";
    case "delivered":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.set("userId", "", { maxAge: 0, path: "/" });

  redirect("/");
}

export default async function AccountPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16 flex flex-col">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">
              Account
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-black transition"
            >
              Back
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-black transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* CONTENT */}
        {user.orders.length === 0 ? (
          <p className="text-gray-700 leading-relaxed">
            No orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="w-full rounded-[2rem] border border-gray-200/70 bg-gray-50/80 px-6 py-6 md:px-12 md:py-8 backdrop-blur-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
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

                <div className="flex justify-between font-medium pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    €{(order.total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}