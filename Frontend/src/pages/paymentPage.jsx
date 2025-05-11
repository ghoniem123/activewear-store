import NavBar from "../components/navbar"
import "../styles/paymentPage.css"
import { useState, useEffect } from 'react';
import axios from 'axios';
const url = import.meta.env.VITE_BACKEND_URL;
import PayItem from "../components/payitem";
import wallet from "../assets/wallet.png";
import Success from "../components/success";
import { CartIDContext } from '../App';
import React from 'react';

export default function MakePayment(){
    const [payItems, setPayITems] = useState([]);
    const [total, setTotal] = useState(0);  
    const [orderNum, setOrderNum] = useState();  
    const [isVisible, setVisible] = useState(false);
    const cartid= React.useContext(CartIDContext)

  async  function order(){

       await axios.post(`${url}/cart/checkout`,{
        
        Country:window.sessionStorage.getItem('country'),
        City:window.sessionStorage.getItem('city'),
        AddressStreet1:window.sessionStorage.getItem('address_line1'),
        AddressStreet2:window.sessionStorage.getItem('address_line2'),
        firstname: window.sessionStorage.getItem('first_name'),
        lastname:window.sessionStorage.getItem('last_name'),
        phone:window.sessionStorage.getItem('phone_number'),
        Cart: cartid
       },

       {withCredentials:true}).then((response) => {
            setOrderNum(response.data._id);
            setVisible(true);
          }).catch((error) => { console.log(error); })
    
    }

    useEffect(()=>
    {  
      async function getCartItems(){


        await axios.get(`${url}/cart/${cartid}` ,{withCredentials:true}).then((response) => {
         console.log(response.data);
         setPayITems([...response.data.cartItems]); 
          setTotal(response.data.total);
        }).catch((error) => { console.log(error); })
  
      }

      getCartItems();
    },[]); 
return(
    <>
     <Success orderNum={orderNum} open={isVisible}/>
    <NavBar/>
    <div className="payment--div">
    {payItems.map(item=> <PayItem key={item._id} {...item}/>)}
    <br/>
    <span className="checkout--span">
    <h1 className="payment--total">{`Price : $ ${total}`}</h1>
    <h1 className="shipping--total">{`Shipping : $ 10`}</h1>
    <hr/>
    <h1 className="total--total">{`Total : $ ${total+10}`}</h1>
    </span>
    <br/>
    <button className="payment--button" onClick={()=>{ order() }}><img src={wallet} className="wallet--img"/>Pay</button>
    </div>
    </>
)  

}