import { promises as fs } from "fs";
import path from "path";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import { generateId } from "@/utils/generateId";

const dataFilePath = path.join(process.cwd(), "data", "orders.json");
const productsFilePath = path.join(process.cwd(), "data", "products.json");

async function getOrders(): Promise<Order[]> {
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data);
}

async function saveOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2));
}

export async function GET() {
  const orders = await getOrders();
  return Response.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, product, quantity, price } = body;

  if (!customerName || !product || !quantity || !price) {
    return Response.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Check stock and deduct if product exists in catalog
  const productsData = await fs.readFile(productsFilePath, "utf-8");
  const products: Product[] = JSON.parse(productsData);
  const productIndex = products.findIndex((p) => p.name === product);

  if (productIndex !== -1) {
    if (products[productIndex].stock < Number(quantity)) {
      return Response.json(
        {
          error: `Insufficient stock. Only ${products[productIndex].stock} available.`,
        },
        { status: 400 }
      );
    }
    products[productIndex].stock -= Number(quantity);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  }

  const orders = await getOrders();
  const matchedProduct = products[productIndex] ?? products.find((p) => p.name === product);
  const newOrder: Order = {
    id: generateId(orders),
    customerName,
    product,
    productImage: matchedProduct?.image || "",
    quantity: Number(quantity),
    price: Number(price),
    total: Number(quantity) * Number(price),
    status: "Pending",
    createdAt: new Date().toISOString().split("T")[0],
  };

  orders.push(newOrder);
  await saveOrders(orders);

  return Response.json(newOrder, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return Response.json(
      { error: "Order ID and status are required" },
      { status: 400 }
    );
  }

  const orders = await getOrders();
  const orderIndex = orders.findIndex((o) => o.id === id);

  if (orderIndex === -1) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  orders[orderIndex].status = status;
  await saveOrders(orders);

  return Response.json(orders[orderIndex]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const orders = await getOrders();
  const filtered = orders.filter((o) => o.id !== id);

  if (filtered.length === orders.length) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  await saveOrders(filtered);

  return Response.json({ message: "Order deleted" });
}
