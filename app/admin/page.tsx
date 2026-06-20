import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

function getStatusStyle(status: string) {
  switch (status) {
    case "paid":
      return "text-white";
    case "shipped":
      return "text-blue-200";
    case "delivered":
      return "text-green-300";
    default:
      return "text-white/45";
  }
}

async function logout() {
  "use server";

  const cookieStore = await cookies();

  cookieStore.set("userId", "", {
    maxAge: 0,
    path: "/",
  });

  redirect("/");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    sort?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const statusFilter = params.status || "all";
  const sortFilter = params.sort || "newest";
  const searchFilter = params.search || "";

  const createFilterUrl = ({
    status = statusFilter,
    sort = sortFilter,
    search = searchFilter,
  }: {
    status?: string;
    sort?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();

    if (status && status !== "all") {
      query.set("status", status);
    }

    if (sort && sort !== "newest") {
      query.set("sort", sort);
    }

    if (search) {
      query.set("search", search);
    }

    const queryString = query.toString();

    return queryString ? `/admin?${queryString}` : "/admin";
  };

  const orders = await prisma.order.findMany({
    where: {
      ...(statusFilter !== "all" && {
        status: statusFilter,
      }),

      ...(searchFilter && {
        OR: [
          {
            name: {
              contains: searchFilter,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchFilter,
              mode: "insensitive",
            },
          },
          {
            items: {
              some: {
                product: {
                  name: {
                    contains: searchFilter,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      }),
    },

    orderBy: {
      createdAt: sortFilter === "oldest" ? "asc" : "desc",
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const filterButtonClass = (active: boolean) =>
    `rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-center transition focus:outline-none ${
      active
        ? "text-white border-white/20"
        : "text-white/70"
    }`;

  return (
    <main className="min-h-screen bg-[#0B1F3A] text-white">
      <section className="max-w-6xl mx-auto px-6 pt-28 md:pt-32 pb-32">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-8 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/45 mb-4">
              Admin Panel
            </p>

            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-5">
              Orders
            </h1>

            <p className="text-sm tracking-[0.18em] uppercase text-white/40">
              Manage Customer Orders
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-white/60 hover:text-white transition"
            >
              Logout
            </button>
          </form>
        </div>

        {/* FILTERS */}
        <div className="max-w-5xl mx-auto mb-8 space-y-5">
          <form action="/admin">
            {statusFilter !== "all" && (
              <input type="hidden" name="status" value={statusFilter} />
            )}

            {sortFilter !== "newest" && (
              <input type="hidden" name="sort" value={sortFilter} />
            )}

            <input
              type="text"
              name="search"
              placeholder="Search by name, email or product..."
              defaultValue={searchFilter}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white transition placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </form>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex flex-wrap items-center gap-4">
              {["all", "paid", "pending", "delivered"].map((status) => {
                const active = statusFilter === status;

                return (
                  <Link
                    key={status}
                    href={createFilterUrl({ status })}
                    className={filterButtonClass(active)}
                  >
                    {status}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {[
                { label: "newest", value: "newest" },
                { label: "oldest", value: "oldest" },
              ].map((item) => {
                const active = sortFilter === item.value;

                return (
                  <Link
                    key={item.value}
                    href={createFilterUrl({ sort: item.value })}
                    className={filterButtonClass(active)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <p className="text-white/70">
                No orders found.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-white/5 px-7 py-7 md:px-10 md:py-8 backdrop-blur-xl"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-8 mb-6">
                  <div className="max-w-[70%]">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-3">
                      Order #{order.id}
                    </p>

                    <h2 className="text-2xl font-medium text-white mb-4">
                      {order.name || "Customer"}
                    </h2>

                    <div className="space-y-1.5 text-sm text-white/60 leading-relaxed">
                      <p>{order.email || "No email"}</p>

                      {order.phone && <p>{order.phone}</p>}

                      {order.address && (
                        <p>
                          {order.address}
                          {order.address2
                            ? `, ${order.address2}`
                            : ""}
                        </p>
                      )}

                      {(order.city || order.region || order.country) && (
                        <p>
                          {order.city}
                          {order.region
                            ? `, ${order.region}`
                            : ""}
                          {order.country
                            ? `, ${order.country}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm text-white/40 mb-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <p
                      className={`text-sm ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-5">
                    Products
                  </p>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-6"
                      >
                        <div>
                          <p className="text-white">
                            {item.product.name}
                          </p>

                          <p className="text-sm text-white/40 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm text-white/60">
                          €
                          {(
                            (item.price * item.quantity) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL */}
                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
                    <p className="text-sm uppercase tracking-[0.18em] text-white">
                      Total
                    </p>

                    <p className="text-xl font-medium text-white">
                      €{(order.total / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}