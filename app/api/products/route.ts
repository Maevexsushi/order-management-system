import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/types/product";

const dataFilePath = path.join(process.cwd(), "data", "products.json");

async function getProducts(): Promise<Product[]> {
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data);
}

async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
}

function generateProductId(products: Product[]): string {
  if (products.length === 0) return "PRD-001";

  const lastId = products
    .map((p) => parseInt(p.id.replace("PRD-", ""), 10))
    .reduce((max, n) => Math.max(max, n), 0);

  return `PRD-${String(lastId + 1).padStart(3, "0")}`;
}

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, stock, category } = body;

  if (!name || !price || stock === undefined) {
    return Response.json(
      { error: "Product name, price, and stock are required" },
      { status: 400 }
    );
  }

  const products = await getProducts();
  const newProduct: Product = {
    id: generateProductId(products),
    name,
    price: Number(price),
    stock: Number(stock),
    category: category || "General",
    createdAt: new Date().toISOString().split("T")[0],
  };

  products.push(newProduct);
  await saveProducts(products);

  return Response.json(newProduct, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, price, stock, category } = body;

  if (!id) {
    return Response.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  if (name !== undefined) products[index].name = name;
  if (price !== undefined) products[index].price = Number(price);
  if (stock !== undefined) products[index].stock = Number(stock);
  if (category !== undefined) products[index].category = category;

  await saveProducts(products);

  return Response.json(products[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  await saveProducts(filtered);

  return Response.json({ message: "Product deleted" });
}
