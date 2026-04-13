"use client";

import { useState, useRef, useEffect } from "react";
import type { Product } from "@/types/product";

function ProductSelector({
  products,
  value,
  onSelect,
}: {
  products: Product[];
  value: string;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = products.find((p) => p.name === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (products.length === 0) {
    return (
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Product
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="e.g. Fireworks Bundle"
        />
      </div>
    );
  }

  return (
    <div className="relative sm:col-span-2" ref={ref}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Product
      </label>
      {/* Hidden input for form validation */}
      <input
        type="text"
        value={value}
        required
        className="sr-only"
        tabIndex={-1}
        onChange={() => {}}
        onInvalid={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-white focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {selected ? (
          <>
            {selected.image ? (
              <img
                src={selected.image}
                alt={selected.name}
                className="h-8 w-8 rounded-md border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="font-medium text-slate-900">{selected.name}</span>
              <span className="ml-2 text-slate-500">
                {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(selected.price)}
              </span>
            </div>
          </>
        ) : (
          <span className="text-slate-400">Select a product...</span>
        )}
        <svg className="ml-auto h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {products.map((p) => (
            <button
              type="button"
              key={p.id}
              disabled={p.stock === 0}
              onClick={() => {
                onSelect(p.name);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                p.stock === 0
                  ? "cursor-not-allowed opacity-50"
                  : p.name === value
                    ? "bg-blue-50"
                    : "hover:bg-slate-50"
              }`}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-9 w-9 rounded-md border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900">{p.name}</div>
                <div className="text-xs text-slate-500">
                  {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(p.price)}
                  {p.stock === 0
                    ? " · Out of stock"
                    : ` · ${p.stock} in stock`}
                </div>
              </div>
              {p.name === value && (
                <svg className="h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CreateOrderModalProps {
  products: Product[];
  onCreated: () => void;
  onCancel: () => void;
}

export default function CreateOrderModal({
  products,
  onCreated,
  onCancel,
}: CreateOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total =
    Number(quantity) > 0 && Number(price) > 0
      ? Number(quantity) * Number(price)
      : 0;

  const selectedProduct = products.find((p) => p.name === product);
  const availableStock = selectedProduct?.stock ?? null;

  function handleProductSelect(productName: string) {
    setProduct(productName);
    setQuantity("");
    const found = products.find((p) => p.name === productName);
    if (found) {
      setPrice(String(found.price));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
      onCreated();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create order.");
    }

    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                New Order
              </h3>
              <p className="text-xs text-slate-500">
                Fill in the details below
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {/* Customer Name */}
            <div className="sm:col-span-2">
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

            {/* Product */}
            <ProductSelector
              products={products}
              value={product}
              onSelect={handleProductSelect}
            />

            {/* Quantity */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setQuantity("");
                    return;
                  }
                  const num = Number(val);
                  if (availableStock !== null && num > availableStock) {
                    setQuantity(String(availableStock));
                  } else {
                    setQuantity(val);
                  }
                }}
                required
                min={1}
                max={availableStock !== null ? availableStock : undefined}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  availableStock !== null && Number(quantity) > 0 && Number(quantity) === availableStock
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                }`}
                placeholder="0"
              />
              {availableStock !== null && (
                <>
                  {availableStock === 0 ? (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      This product is out of stock.
                    </p>
                  ) : Number(quantity) === availableStock ? (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      Maximum order reached — only {availableStock} in stock.
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {availableStock} available in stock
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Price (PHP)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  if (products.length === 0) setPrice(e.target.value);
                }}
                readOnly={products.length > 0}
                required
                min={1}
                className={`w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors ${
                  products.length > 0
                    ? "cursor-not-allowed bg-slate-100 text-slate-500"
                    : "bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                }`}
                placeholder="0.00"
              />
              {products.length > 0 && (
                <p className="mt-1.5 text-xs text-slate-400">
                  Price is set by the selected product.
                </p>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Total + Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <div>
              {total > 0 && (
                <p className="text-sm text-slate-500">
                  Total:{" "}
                  <span className="text-base font-bold text-slate-900">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(total)}
                  </span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
