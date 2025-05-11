import {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import NavBar from '../components/navbar'
import '../styles/orderPage.css'
const url = import.meta.env.VITE_BACKEND_URL;
import moment from 'moment';
import visa from '../assets/visa.png'
import info from '../assets/info.png'
import InfoHover from '../components/infoHover'

export default function OrderPage() {
   const [order, setOrder] = useState()
   const [isVisible, setVisible] = useState(false);
   const params = useParams();


    useEffect(() => {

        async function getOrder() {

               await axios.get(`${url}/cart/checkout/${params.id}`,{withCredentials:true}).then((response) => {
                setOrder(response.data);
                
                 

            }).catch((error) => { console.log(error); })
        }

        getOrder();
    }, [params.id]);

    if (!order) {
      return <h1>Loading...</h1>
  }

    return (
        <>
        <InfoHover info={true} open={isVisible} ordernum={order._id} close={ ()=>setVisible(false) }  title={"Order Number : "} body={"Save the order number to be allow to track your order!!"} />
        <NavBar />
        <div className="order--div">
            <h1 className ="order--h1">{`Hi! ${order.firstname} ${order.lastname}!`}</h1>
            <p className ="order--p">Your order is currently <span className="order--status">{`${order.shippingStatus}`}</span>, once confirmed you will receive an email from us!</p>
           <div className="order--div--1">
              <h1 className ="order--h1">Order Details</h1>
                <span className="order--span">
                    <label className="order--label">Order Number : </label>
                    <span className="order--num"><p className="order--details">{order._id}  <img src={info} className="info--img" alt="info" onClick={()=>  setVisible(true)}/></p></span>
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
           </div>
           <div className="order--div--1">
              <h1 className="order--h1">Total Amount</h1>
              <span className="order--span">
                    <label className="order--label">Items price : </label>
                    <p className="order--details">{`$ ${order.total-order.shippingCost}`}</p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label">Shipping : </label>
                    <p className="order--details">{`$ ${order.shippingCost}`}</p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label">Discount : </label>
                    <p className="order--details">$ 0</p>
                 </span>   
                 <span className="order--span">
                    <label className="order--label--total">Total : </label>
                    <p className="order--details--total">{`$ ${order.total}`}</p>
                 </span>   
           </div>
           <p className="order--p">Thank you for shopping with us !</p>
       </div>
        </>
    )

}