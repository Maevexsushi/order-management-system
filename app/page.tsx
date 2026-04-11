"use client";

import { useEffect, useState, useCallback } from "react";
import type { Order, OrderStatus } from "@/types/order";
import OrderTable from "@/components/OrderTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(id: string, status: OrderStatus) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    await fetch(`/api/orders?id=${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetchOrders();
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <h1 className="text-xl font-bold text-slate-900">Orders Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of all your orders and revenue
        </p>
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Orders</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalOrders}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-amber-600">Pending</p>
            <p className="mt-1 text-2xl font-bold text-amber-700">
              {pendingOrders}
            </p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-green-600">Delivered</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {deliveredOrders}
            </p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                maximumFractionDigits: 0,
              }).format(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={(id) => setDeleteTarget(id)}
        />
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          orderId={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
