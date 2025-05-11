import CartItem from '../components/cartItem';
import van from '../assets/van.png';
import { useState, useEffect } from 'react'; 
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
const url = import.meta.env.VITE_BACKEND_URL;
import '../styles/cartPage.css';
import Navbar from '../components/navbar';
import InfoHover from '../components/infoHover';
import { CartIDContext } from '../App';
import React from 'react';



export default function ProductsPage (){
    const [cartItems, setCartITems] = useState([]);
    const [total, settotal] = useState(0); 
    const [isVisible, setVisible] = useState(false); 
    const navigate = useNavigate();
    const cartid= React.useContext(CartIDContext)


    useEffect(()=>
    {   
      async function getCartItems(){
        await axios.get(`${url}/cart/${cartid}`  ,{withCredentials:true}).then((response) => {
          setCartITems([...response.data.cartItems]); 
          settotal(response.data.total);
        }).catch((error) => { console.log(error); })
  
      }

      getCartItems();
    },[cartItems]); 

    function checkout(){
      if(total === 0){
        return setVisible(true);
      }
      navigate("/info")
    }

return (
  <>
  <InfoHover error={true} open={isVisible}  close={ ()=>setVisible(false) }  title={"No products in the cart"} body={"please, add products in the carts to checkout!!"} />
  <Navbar/>
  <div className="cart--page--div">
      {cartItems.map(cartItem => <CartItem key={cartItem._id} {...cartItem}/> )} 
      {total === 0 && <h1 className="cart--total">No products in the cart</h1>}
      <h1 className="cart--total">{`Total : $ ${total}`}</h1>
      <span className="checkout">
      <button className="cart--checkout--button" onClick={()=>{checkout()}}><img src={van} className="checkout--img"/>Checkout</button>
      </span>
  </div>
  </>
)
}
