// import { useState } from 'react'
import ProductsPage from './pages/productsPage'
import React from 'react';
import ViewPage from './pages/ViewPage'
import CartPage from './pages/CartPage'
import MakePayment from './pages/paymentPage'
import InformationPage from './pages/InformationPage'
import OrderPage from './pages/OrderPage'
import TrackPage from './pages/trackPage'
import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './style.css'
export const CartIDContext = React.createContext();
const url= import.meta.env.VITE_BACKEND_URL;


function App() {
  const [isCartIdReady, setIsCartIdReady] = useState(false);

  async function getCartId() {
    await axios.post(`${url}/create`, { withCredentials: true }).then((response) => {
      window.sessionStorage.setItem('cartid', response.data.cartId);
      setIsCartIdReady(true);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    const storedCartId = window.sessionStorage.getItem('cartid');
    if (storedCartId === null) {
      getCartId();
    } else {
      setIsCartIdReady(true);
    }
  }, []);

  if (!isCartIdReady) {
    return (
        <h1 >Loading...</h1>
    );
  }

  return (
  
    <CartIDContext.Provider value={window.sessionStorage.getItem('cartid')}>
      <Routes>
        
        <Route path="/" element={<ProductsPage />} />
        <Route path="/:id" element={<ViewPage />} />
        <Route path="/mycart" element={<CartPage />} />
        <Route path="/info" element={<InformationPage />} />
        <Route path="/pay" element={<MakePayment />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </CartIDContext.Provider>
    
  );
}

export default App;
