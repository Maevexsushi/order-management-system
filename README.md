# 🧾 Order Management System (Next.js + JSON Database)

## 📌 Project Overview

This project is a simple **Order Management System** built using Next.js.
Instead of using a real database, data will be stored in a **JSON-based structure** (simulating a backend).

This mimics how real systems work while keeping things beginner-friendly.

---

## 🎯 Objectives

* Learn how to build a CRUD system in Next.js
* Understand how data flows between frontend and backend
* Practice working with JSON as a mock database
* Build a clean and functional dashboard UI

---

## ⚙️ Tech Stack

* Next.js (App Router)
* React Hooks
* JSON (mock database)
* Tailwind CSS (optional)

---

## 🗂️ Data Storage (JSON)

You will simulate a database using either:

### Option A (Recommended)

Create a local JSON file:

/data/orders.json

Example structure:
[
{
"id": "ORD-001",
"customerName": "Juan Dela Cruz",
"product": "Fireworks Bundle",
"quantity": 2,
"price": 500,
"total": 1000,
"status": "Pending",
"createdAt": "2026-04-10"
}
]

---

### Option B (Alternative)

Use `localStorage` with the same JSON structure.

---

## 📂 Core Features

### ✅ 1. Create Order

* Form inputs:

  * Customer Name
  * Product Name
  * Quantity
  * Price
* Auto compute:

  * Total = Quantity × Price
* Generate Order ID (e.g., ORD-001)

---

### 📋 2. View Orders

* Display all orders in a table
* Show:

  * Order ID
  * Customer
  * Product
  * Total
  * Status
  * Date Created

---

### 🔄 3. Update Order Status

Statuses:

* Pending
* Processing
* Shipped
* Delivered
* Cancelled

👉 Use dropdown or buttons

---

### ❌ 4. Delete Order

* Remove an order from the list
* Add confirmation (optional)

---

## 🔌 API Simulation (Important)

Even though you're using JSON, you should still create API routes to simulate a backend:

/app/api/orders/route.js

### Required Methods:

* GET → Fetch all orders
* POST → Add new order
* PUT → Update order status
* DELETE → Remove order

👉 This teaches real backend structure using Next.js

---

## 🧠 Business Logic Rules

* Total = Quantity × Price
* Default status = Pending
* Order ID should be unique
* Delivered/Cancelled orders cannot be edited (optional challenge)

---

## 🧩 Suggested Folder Structure

/app
/page.js
/api/orders/route.js
/components

* OrderForm.jsx
* OrderTable.jsx
* StatusBadge.jsx
  /data
* orders.json
  /utils
* generateId.js
* formatCurrency.js

---

## 🎨 UI/UX Guidelines

### Layout

* Header: "Order Management System"
* Top section: Add Order Form
* Bottom: Orders Table

---

### Status Colors

* Pending → Yellow
* Processing → Blue
* Shipped → Purple
* Delivered → Green
* Cancelled → Red

---

## ✨ Bonus Features (Optional)

* 🔍 Search by customer name
* 🎯 Filter by status
* 🕒 Sort by date
* 💬 Toast notifications
* ✏️ Edit order details

---

## 🚀 Stretch Goals

* Replace JSON with real database (MongoDB/MySQL)
* Add authentication (admin login)
* Deploy the app (Vercel)

---

## ⚠️ Notes

* JSON file updates may require server restart (depending on implementation)
* Treat API routes as your “backend”

---

## 🧪 Evaluation Criteria

* Working CRUD operations
* Clean component structure
* Proper API usage
* Good UI/UX
* Code readability

---

## 🎉 Expected Output

A working dashboard where you can:

* Add orders
* View all orders
* Update their status
* Delete orders

---

## 💡 Tips

* Start with static UI first
* Then connect API step-by-step
* Console.log is your best friend 😄

---

## 🏁 Goal

By completing this, you will understand how a **real-world order system works**, even without a real database.

Good luck 🚀
