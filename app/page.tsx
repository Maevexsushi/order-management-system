"use client";

import { useEffect, useState, useCallback } from "react";
import type { Order, OrderStatus } from "@/types/order";
import OrderForm from "@/components/OrderForm";
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Order Management System
            </h1>
            <p className="text-sm text-slate-500">
              Track and manage your orders
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
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

        {/* Order Form */}
        <div className="mb-8">
          <OrderForm onOrderCreated={fetchOrders} />
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={(id) => setDeleteTarget(id)}
        />
      </main>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          orderId={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
