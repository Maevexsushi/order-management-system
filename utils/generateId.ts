import type { Order } from "@/types/order";

export function generateId(orders: Order[]): string {
  if (orders.length === 0) return "ORD-001";

  const lastId = orders
    .map((o) => parseInt(o.id.replace("ORD-", ""), 10))
    .reduce((max, n) => Math.max(max, n), 0);

  return `ORD-${String(lastId + 1).padStart(3, "0")}`;
}
