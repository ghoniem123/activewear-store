/* eslint-disable react/prop-types */
import ReactDOM from 'react-dom';
import "../styles/success.css";
import { useNavigate } from 'react-router-dom';
import close from "../assets/close.png";
import checked from "../assets/checked.png";



export default function Success(props){
    const navigate = useNavigate();
        if (!props.open) return null;
    
    return ReactDOM.createPortal( 
    <>
    <div className="success--div--overlay"/> 
        <div className="success--div"> 
         <button className="close--button" onClick ={()=> navigate(`/order/${props.orderNum}`)}> <img src={close} className="close--img"/> </button>

           <span className="success-span">
            <img src={checked} className="success--img"/>
            <h1 className="success--h1">Payment Successful </h1>
            <p className="success--p">Your order has been placed successfully</p>
            </span>  
    </div>
    </>   ,document.getElementById('pop-ups')
    )
    }
