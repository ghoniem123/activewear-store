
# 🛍️ ActiveWear Frontend

This is the frontend for the **ActiveWear** E-Commerce platform. It is built using **React** and **Vite**, and it communicates with the backend API to display product listings, support filtering, manage carts, and handle checkout flows.

---

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── assets/        # Static images and media
│   ├── components/    # Reusable UI components
│   ├── pages/         # Route-based page components
│   ├── styles/        # CSS styling files
│   ├── App.jsx        # App component with routing
│   └── main.jsx       # Application entry point
├── .env               # Environment variable for API URL
├── .gitignore
├── index.html         # HTML template
├── package.json
├── vite.config.js     # Vite configuration
```

---

## ⚙️ Setup & Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

Create a `.env` file in the root directory with the following content:

```env
VITE_BACKEND_URL="http://localhost:3000/api"
```

Replace the value with your actual backend API URL.

---

## 🚀 Running the Development Server

Start the frontend development server with:

```bash
npm run dev
```

By default, the app runs at:  
[http://localhost:5173](http://localhost:5173)

Ensure the backend (ActiveWear API) is running and accessible at the URL defined in `.env`.

---

## 🔍 Key Features

- 🛍️ View product listings
- 🎯 Filter products by category, name, or custom criteria
- 🛒 Add and remove items from the cart
- 🧾 Checkout flow 
- 🔗 Dynamic backend integration via environment variables

---

## 📦 Technologies Used

- **React**
- **Vite**

---

## 📄 License

MIT License. See `LICENSE` for more details.
