# 🏋️‍♀️ GymShark Backend API

This is the backend API for the ActiveWear E-Commerce platform. It manages product listings, shopping carts, and order processing, and connects to a MongoDB database.

---

## 📁 Project Structure

```
Backend/
├── Controller/          # Business logic for products and carts
│   ├── cartController.js
│   └── productController.js
├── DataInsertions/      # Database seeding scripts
│   └── productsData.js
├── Middleware/          # JWT auth middleware (currently unused)
│   └── authenticationMiddleware.js
├── Models/              # Mongoose schemas for MongoDB collections
│   ├── Cart.js
│   ├── CartItem.js
│   ├── Order.js
│   ├── Product.js
│   ├── Session.js
│   └── User.js
├── Routes/              # Express route definitions
│   ├── CartRouter.js
│   └── ProductRouter.js
├── app.js               # Express application entry point
├── package.json         # Project metadata and dependencies
```

---

## ⚙️ Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file**

   Your `.env` file must include the following variables:

   ```env
   ORIGIN=               # Frontend URL for CORS (e.g., http://localhost:5173)
   PORT=                 # Port number to run the server
   DB_NAME=              # MongoDB database name
   DB_URL=               # MongoDB connection string (e.g., mongodb://127.0.0.1:27017)
   SHIPPING_COST=        # Default shipping cost used in checkout
   ```

---

## 🚀 Running the Server

You can start the server using:

```bash
npm start
```

> This runs the `start` script defined in `package.json` (which internally executes `node app.js`).

Ensure your `.env` file is properly configured before starting the server.

---

## 🌱 Seeding the Database

To populate the `products` collection with sample data, run:

```bash
node --env-file=../.env DataInsertions/productsData.js
```

Make sure the `.env` file contains valid `DB_URL` and `DB_NAME` values.

---

## 📦 API Endpoints

### 🛍️ Product Routes (`/api/products`)

| Method | Endpoint         | Description                       |
|--------|------------------|-----------------------------------|
| GET    | `/`              | Get all products                  |
| GET    | `/view/:id`      | Get product by ID                 |
| POST   | `/filter`        | Filter products by query params   |

---

### 🛒 Cart Routes (`/api/cart`)

| Method | Endpoint           | Description                         |
|--------|--------------------|-------------------------------------|
| POST   | `/create`          | Create a new cart                   |
| POST   | `/`                | Add item to cart                    |
| PUT    | `/`                | Update quantity of a cart item      |
| GET    | `/:id`             | View a cart by ID                   |
| DELETE | `/:id`             | Remove item from cart               |
| POST   | `/checkout`        | Checkout the cart                   |
| GET    | `/checkout/:id`    | Get specific order details          |
| GET    | `/track/:id`       | Track an order by ID                |


---

## 🔐 Authentication Middleware (Optional)

- A placeholder for JWT authentication exists in `Middleware/authenticationMiddleware.js`.
- It is currently **commented out and inactive**.

---

## 🧪 Technologies Used

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**


---
