"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import OrderTable from "@/components/OrderTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import CreateOrderModal from "@/components/CreateOrderModal";

export default function CreateOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

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

  function handleOrderCreated() {
    setShowForm(false);
    fetchOrders();
    fetchProducts();
  }

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create Order</h1>
            <p className="mt-1 text-sm text-slate-500">
              View orders and create new ones
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Order
          </button>
        </div>
      </div>

      <div className="px-8 py-8">
        <OrderTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={(id) => setDeleteTarget(id)}
        />
      </div>

      {/* Create Order Modal */}
      {showForm && (
        <CreateOrderModal
          products={products}
          onCreated={handleOrderCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

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
