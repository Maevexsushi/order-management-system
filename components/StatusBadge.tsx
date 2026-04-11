import type { OrderStatus } from "@/types/order";

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Shipped: "bg-purple-50 text-purple-700 ring-purple-600/20",
  Delivered: "bg-green-50 text-green-700 ring-green-600/20",
  Cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

const statusDots: Record<OrderStatus, string> = {
  Pending: "bg-amber-500",
  Processing: "bg-blue-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`} />
      {status}
    </span>
  );
}
