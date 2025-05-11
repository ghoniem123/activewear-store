/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
const url = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import '../styles/cartItems.css';
import "../styles/payItem.css"

export default function PayItem(props){
    const [product, setProduct] = useState(null);

    useEffect(() => {
        async function getProduct() {
            await axios.get(`${url}/products/view/${props.productId}`,{withCredentials:true}).then((response) => {
                setProduct(response.data);
            }).catch((error) => { console.log(error); })
        }
        getProduct();
    }, []);

    if (!product) {
        return <h1>Loading...</h1>
    }

    return (
        <div className='cartitem--div'>
          <img className="cartitem--image" src={product.image} alt={product.name} />
          
          <span className="cartitem--span--1">
          <h5 className="cartitem--name">{product.name}</h5>
          <p className="cartitem--size">{`Size : ${props.productSize}`}</p>
          </span>

          <p className="cartitem--total--price"><span className="total--price--title">Total price : </span>{`$ ${props.total}`}</p>

          <p className='quantity--display--pay'>{`Quantity : ${props.quantity}`}</p>
        </div>
    );
}