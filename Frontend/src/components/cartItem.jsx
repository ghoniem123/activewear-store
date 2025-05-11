/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import close from '../assets/close.png';
import plus from '../assets/plus.png';
import minus from '../assets/minus.png';
import { useState, useEffect, useContext } from 'react';
const url = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import '../styles/cartItems.css';
import InfoHover from './infoHover';
import { CartIDContext } from '../App';
import React from 'react';



export default function CartItem(props){
 const [product, setProduct] = useState(null);
 const [quantity, setQuantity] = useState(props.quantity);
 const [isVisible, setVisible] = useState(false);
 const [isVisibleQuantity, setVisibleQuantity] = useState(false);
 const cartid= React.useContext(CartIDContext)



   async function quantity_up(){
        await axios.put(`${url}/cart`,{id:props._id,quantity:(quantity+1), Cart: cartid},{withCredentials:true}).then((response) => {
            setQuantity(response.data.quantity);
          }).catch((error) => { 
        return  setVisibleQuantity(true);
        })
    }

    async function quantity_down(){
        if (quantity === 1) {
            return setVisible(true);
        }

        await axios.put(`${url}/cart`,{id:props._id,quantity:(quantity-1), Cart: cartid},{withCredentials:true}).then((response) => {
            setQuantity(response.data.quantity);
          }).catch((error) => { console.log(error); })
    }

   async function remove(){
        await axios.delete(`${url}/cart/${props._id}?Cart=${cartid}`,{withCredentials:true}).then((response) => {
            setProduct(null);
          }).catch((error) => { console.log(error); })
    }


    useEffect(() => {
        async function getProduct() {
            await axios.get(`${url}/products/view/${props.productId}`,{withCredentials:true}).then((response) => {
                setProduct(response.data);
            }).catch((error) => { console.log(error); })
        }
        getProduct();
    }, [props.productId]);

    if (!product) {
        return ;
    }

    return (
       product &&(
        <>
     <InfoHover error={true} open={isVisible}  close={ ()=>setVisible(false) }  title={"You cant decrease the product quantity below 1"} body={"If you want to remove the product press on the X button beside the product!!"} />
     <InfoHover error={true} open={isVisibleQuantity}  close={ ()=>setVisibleQuantity(false) }  title={"you cant add more of this product"} body={"you have reached the max quantity of the product!!"} />
        <div className='cartitem--div'>
          <img className="cartitem--image" src={product.image} alt={product.name} />
          <span className="cartitem--span--1">
          <h5 className="cartitem--name">{product.name}</h5>
          <p className="cartitem--size">{`Size : ${props.productSize}`}</p>
          <p className="cartitem--price">{`Price : $ ${product.price}`}</p>
          </span>

          <p className="cartitem--total--price"><span className="total--price--title">Total price : </span>{`$ ${props.total}`}</p>

          <span className="cartitem--span--3">
          <button className='cartitem--remove--button' onClick={ ()=>{remove()} }><img src={close} className='close--img'/></button>
            <span className='cartitem--quantity--span'>
            <button className='quantity--button' onClick={ ()=>{ quantity_up()} }><img src={plus} className='plus--img'/></button>
            <button className='quantity--display'>{quantity}</button>
            <button className='quantity--button' onClick={ ()=>{ quantity_down()} }><img src={minus} className='minus--img'/></button>
            </span>
          </span>
        </div>
        </>
       )
    );
}