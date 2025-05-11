/* eslint-disable react/prop-types */
import ReactDOM from 'react-dom';
import "../styles/success.css";
import close from "../assets/close.png";
import warn from "../assets/warn.png";
import error from "../assets/error.png";
import checked from "../assets/checked.png";


export default function Success(props){
        if (!props.open) return null;
    
    return ReactDOM.createPortal( 
     <>   
    <div className="success--div--overlay"/> 
     { props.info &&
        <div className="success--div"> 
         <button className="close--button" onClick={props.close} > <img src={close} className="close--img"/> </button>

           <span className="success-span">
           <img src={warn} className="success--img"/>
            <h1 className="success--h1">{props.title}{props.ordernum} </h1>
            <p className="success--p">{props.body}</p>
            </span> 
            </div> 

     }
     { props.error&&
        <div className="error--div"> 
         <button className="close--button" onClick={props.close} > <img src={close} className="close--img"/> </button>

           <span className="success-span">
           <img src={error} className="success--img"/>
            <h1 className="success--h1">{props.title}{props.ordernum} </h1>
            <p className="success--p">{props.body}</p>
            </span> 
            </div> 

     }
      {
        props.confirm&&
        <div className="success--div"> 
         <button className="close--button" onClick={props.close} > <img src={close} className="close--img"/> </button>

           <span className="success-span">
           <img src={checked} className="success--img"/>
            <h1 className="success--h1">{props.title}{props.ordernum} </h1>
            <p className="success--p">{props.body}</p>
            </span> 
            </div> 
      } 

  
    </>   ,document.getElementById('pop-ups')
    )
    }

