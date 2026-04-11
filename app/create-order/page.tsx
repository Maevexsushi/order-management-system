"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

export default function CreateOrderPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const total =
    Number(quantity) > 0 && Number(price) > 0
      ? Number(quantity) * Number(price)
      : 0;

  function handleProductSelect(productName: string) {
    setProduct(productName);
    const found = products.find((p) => p.name === productName);
    if (found) {
      setPrice(String(found.price));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        product,
        quantity: Number(quantity),
        price: Number(price),
      }),
    });

    if (res.ok) {
      router.push("/");
    }

    setSubmitting(false);
  }

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <h1 className="text-xl font-bold text-slate-900">Create Order</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details to create a new order
        </p>
      </div>

      <div className="px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-5">
            {/* Customer Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Juan Dela Cruz"
              />
            </div>

            {/* Product Selection */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Product
              </label>
              {products.length > 0 ? (
                <select
                  value={product}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} — {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(p.price)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Fireworks Bundle"
                />
              )}
              {products.length === 0 && (
                <p className="mt-1.5 text-xs text-slate-400">
                  No products yet. You can type a product name or add products
                  from the Products page first.
                </p>
              )}
            </div>

            {/* Quantity & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min={1}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Price (PHP)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={1}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Total + Submit */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <div>
              {total > 0 && (
                <p className="text-sm text-slate-500">
                  Order Total:{" "}
                  <span className="text-lg font-bold text-slate-900">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(total)}
                  </span>
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
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
              {submitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
