/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
const url = import.meta.env.VITE_BACKEND_URL;
import '../styles/trackpage.css';
import tracking from '../assets/tracking.png';
import moment from 'moment';
import visa from '../assets/visa.png'
import delivery from '../assets/delivery.gif'
import InfoHover from '../components/infoHover'

export default function TrackPage() {
   const [order, setOrder] = useState(null);
   const [isVisible, setVisible] = useState(false);
    const [isOrder, setIsOrder] = useState(false);

    async function getOrder() {
        const orderId = document.querySelector('.track--input').value;
        if (orderId === null || orderId === undefined || orderId === '') {
            return   setVisible(true);
        }
        await axios.get(`${url}/cart/track/${orderId}`,{withCredentials:true}).then((response) => {
            console.log(response.data);
            if (response.data === null || response.data === undefined) {
                return setIsOrder(true);
            }
            setOrder(response.data);
        }).catch((error) => {  return setVisible(true); })
    }

    return (
        <>
        <InfoHover error={true} open={isVisible} close={ ()=>setVisible(false) }  title={"Please enter a valid order number"} body={"Order number was provided to you after payment, check it in your email or if you have saved it!!"} />
        <InfoHover info={true} open={isOrder} close={ ()=>setIsOrder(false) }  title={"Order is not found"} body={"pls check the order number and try again or contact us for more information!!"} />
        <Navbar/>
        <div className="track--div">

            <div className="track--div--input">
                <input type="text" className="track--input" placeholder="Order Number"  />
                <button className="track--button" onClick={()=>getOrder()}><img src={tracking} className="tracking--img"/>Track</button>
            </div>
           <br/>
            {order && (
                <div className="track--order--div">

                    <img src={delivery} className="delivery--img"/>
                   
                   <div className="order--div--1">
              <h1 className ="order--h1">Order Details</h1>
                <span className="order--span">
                    <label className="order--label">Order Status : </label>
                    <p className="order--details">{order.shippingStatus} </p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label">Order Date : </label>
                    <p className="order--details">{moment(order.createdAt).format('MMMM DD YYYY, h:mm a')}</p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label">Payment Method : </label>
                    <p className="order--details"><img src={visa} className='order--visa'/> xxx6592</p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label"> Shipping Address : </label>
                    <p className="order--details">{`${order.HouseNumber}, ${order.Street}, ${order.City}, ${order.Country} `}</p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label--total">Total : </label>
                    <p className="order--details--total">{`$ ${order.total}`}</p>
                 </span>   
           </div>
                </div>
            )}
        </div>
        </>
    );
}   