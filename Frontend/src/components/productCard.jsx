/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import "../styles/productcard.css";


export default function ProductCard(props) {
  const navigate = useNavigate();

  return (
      <div className='card--div'onClick={()=> navigate(`/${props._id}`)}>
        <img className="card--image" src={props.image} alt={props.name} />
        <span className="card--span">
        <h4 className="card--name">{props.name}</h4>
        <p className="card--price">{`$ ${props.price}`}</p>
        <p className='view--product--button' >View product</p> 
          </span>  
      </div>
  )}

