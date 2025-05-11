/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from 'axios';
const url = import.meta.env.VITE_BACKEND_URL;
import '../style.css';
import { useParams } from 'react-router-dom';
import bag from '../assets/bag.png';
import Navbar from '../components/navbar';
import "../styles/viewproduct.css";
import InfoHover from '../components/infoHover';
import { CartIDContext } from '../App';
import { useContext } from "react";
import React from 'react';


export default function ViewPage() {
    console.log(window.sessionStorage.getItem('cartid'));
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); 
    const [isVisible, setVisible] = useState(false);
    const [isAdded, setAdded] = useState(false);
    const [isVisibleQuantity, setVisibleQuantity] = useState(false);
    const params = useParams();
    let lastClickedButton = null;
    const buttons = document.querySelectorAll('.size--button');
    const cartid= React.useContext(CartIDContext)


    async function addToCart() {
        if(!selectedSize) {
            return setVisible(true);
        }
        await axios.post(`${url}/cart`, { productId: product._id, productSize: selectedSize,Cart: cartid }, { withCredentials: true })
        .then((response) => {
           setAdded(true);

            buttons.forEach(button=>{
                button.style.backgroundColor = ''; 
                button.style.borderColor = ''; 
                button.style.color = ''; 
            
            })
            setSelectedSize(null);
            
        })
        .catch((error) => { setVisibleQuantity(true); });
    }

    useEffect(() => {

        async function getProduct() {
            await axios.get(`${url}/products/view/${params.id}`,{withCredentials:true}).then((response) => {
                setProduct(response.data);
            }).catch((error) => { console.log(error); })
        }
        getProduct();
    }, [params.id]);


        buttons.forEach(button => {
        button.addEventListener('click', () => {
        if (lastClickedButton !== null) {
            lastClickedButton.style.backgroundColor = ''; 
            lastClickedButton.style.borderColor = ''; 
            lastClickedButton.style.color = ''; 
        }
        lastClickedButton = button;
        button.style.backgroundColor = '#000'; 
        button.style.borderColor = '#fff'; 
        button.style.color = '#fff'; 
          });
      });

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    }

    if (!product) {
        return <h1>Loading...</h1>
    }

    return (
        <>
        <InfoHover error={true} open={isVisible}  close={ ()=>setVisible(false) }  title={"You must select a size"} body={"Please select a size to add the product to the cart!!"} />
        <InfoHover confirm={true} open={isAdded}  close={ ()=>setAdded(false) }  title={"Product added to cart"} body={`The ${product.name} has been added to the cart!!`} />
        <InfoHover error={true} open={isVisibleQuantity}  close={ ()=>setVisibleQuantity(false) }  title={"you cant add more of this product"} body={"you have reached the max quantity of the product!!"} />

        <Navbar/>
        <div className='view--div'>
            <span className="view--img--span">
                <img src={product.image} alt={product.name} className='view--img' />
            </span>
            <span className="view--info--span">
                <h3 className="view--name">{product.name}</h3>
                <p className="view--descript">{product.description}</p>
                <p className="view--price">{`$ ${product.price}`}</p>
                <h6 className='view--h6'>SELECT SIZE</h6>
                <div className="view-button-div">
                { product.sizes.find(size => size.size === 'S')&&   <button className='size--button' onClick={() => handleSizeClick('S')}  disabled={product.sizes.find(size => size.size === 'S') === undefined || product.sizes.find(size => size.size === 'S').quantity === 0}>S</button>}
                { product.sizes.find(size => size.size === 'M')&&    <button className='size--button' onClick={() => handleSizeClick('M')}  disabled={product.sizes.find(size=>size.size==="M")===undefined||product.sizes.find(size => size.size === 'M').quantity === 0}>M</button>}
                { product.sizes.find(size => size.size === 'L')&&   <button className='size--button' onClick={() => handleSizeClick('L')} disabled={product.sizes.find(size=>size.size==="L")===undefined||product.sizes.find(size => size.size === 'L').quantity === 0}>L</button>}
                { product.sizes.find(size => size.size === 'XL')&&   <button className='size--button' onClick={() => handleSizeClick('XL')} disabled={product.sizes.find(size=>size.size==="XL")===undefined||product.sizes.find(size => size.size === 'XL').quantity === 0}>XL</button>}
                { product.sizes.find(size => size.size === 'XXL')&&   <button className='size--button' onClick={() => handleSizeClick('XXL')} disabled={product.sizes.find(size=>size.size==="XXL")===undefined || product.sizes.find(size => size.size === 'XXL').quantity === 0}>XXL</button>}
                </div>
                <button className='view--button' onClick={
                    ()=>{
                        addToCart();
                    }
                } ><img src={bag} className="shopping--bag"/> &nbsp; ADD TO CART</button>
            </span>
        </div>
        </>
    )
}