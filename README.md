
# 🛍️ ActiveWear E-Commerce Platform

**ActiveWear** is a full-stack e-commerce platform for activewear products, built with a modern JavaScript stack (MERN Stack). It features dynamic product listings, filtering, cart management, and checkout capabilities. This project includes:

- A **React + Vite** frontend
- A **Node.js + Express** backend
- **MongoDB** as the database

---

## 📦 Project Structure

```
ActiveWear/
├── Backend/       # Node.js + Express API
├── Frontend/      # React + Vite UI
```

---

## 🧩 Prerequisites

- **Node.js** (v16+ recommended)
- **MongoDB** (running locally or remotely)

---

## 🚀 Installation & Running the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/activewear.git
cd activewear
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Create Backend Environment File

Create a `.env` file inside the `Backend/` directory:

```env
ORIGIN=http://localhost:5173
PORT=3000
DB_NAME=GymShark
DB_URL=mongodb://127.0.0.1:27017
SHIPPING_COST=10
```

### 4. Start the Backend Server

```bash
npm start
```

> The backend API will be running at `http://localhost:3000`.

---

### 5. Install Frontend Dependencies

Open a new terminal window:

```bash
cd ../Frontend
npm install
```

### 6. Create Frontend Environment File

Create a `.env` file inside the `Frontend/` directory:

```env
VITE_BACKEND_URL="http://localhost:3000/api"
```

### 7. Start the Frontend Development Server

```bash
npm run dev
```

> The frontend will be available at [http://localhost:5173](http://localhost:5173)

---

## 🌱 Seed the Database (Optional)

To populate the `products` collection with initial data, run the following from the `Backend/` folder:

```bash
node --env-file=.env DataInsertions/productsData.js
```

---

## 🔗 Backend API Overview

### `/api/products`
- `GET /` – List all products
- `GET /view/:id` – View a product by ID
- `POST /filter` – Filter products

### `/api/cart`
- `POST /create` – Create a new cart
- `POST /` – Add item to cart
- `PUT /` – Update quantity
- `GET /:id` – View cart
- `DELETE /:id` – Remove item
- `POST /checkout` – Checkout cart
- `GET /checkout/:id` – View order
- `GET /track/:id` – Track order

---

## 🔍 Key Features

- 🛍️ Browse product listings
- 🎯 Filter products by category or keyword
- 🛒 Manage shopping cart
- 🧾 Checkout workflow
- 💬 Clean UI with dynamic backend integration

---

## 🛠️ Technologies Used

### Frontend:
- React
- Vite

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose

---

## 📄 License

This project is licensed under the MIT License.
