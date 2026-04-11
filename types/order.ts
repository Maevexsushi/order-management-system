export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
