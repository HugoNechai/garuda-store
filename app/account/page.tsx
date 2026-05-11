import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

function getStatusStyle(status: string) {
  switch (status) {
    case "paid":
      return "text-white/80";
    case "shipped":
      return "bg-white/20 text-white";
    case "delivered":
      return "bg-green-500/80 text-white";
    default:
      return "bg-white/15 text-white/80";
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#102a4c] to-[#f8fbff] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

      <section className="relative max-w-6xl mx-auto px-6 pt-28 md:pt-32 pb-32 md:pb-40">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
              Account
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-5">
              Dashboard
            </h1>

            <p className="text-sm md:text-base tracking-[0.18em] uppercase text-white/45">
              Review Your Orders
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition"
            >
              Back
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-white/60 hover:text-white transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto">
          {user.orders.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <p className="text-white/70 leading-relaxed">
                No orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="w-full rounded-[2rem] border border-white/10 bg-white/5 px-6 py-6 md:px-12 md:py-8 backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-sm text-white/45">
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

                  <div className="space-y-3 mb-5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-6 text-sm text-white/75"
                      >
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>

                        <span className="text-white/70">
                          €{((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-medium pt-4 border-t border-white/10">
                    <span className="text-white">Total</span>

                    <span className="text-white">
                      €{(order.total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}