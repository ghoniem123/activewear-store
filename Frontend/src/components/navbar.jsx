/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import search from "../assets/search.png";
import gymshark from "../assets/gymshark.png";
import cart from "../assets/cart.png";
import SideBar from "./sidebar";
import "../styles/navbar.css";
import { useLocation } from "react-router-dom";

export default function NavBar({filterbar, visible}) {

  const location = useLocation();

  const show = () => {
    filterbar(!visible);
  };


  return (
    <>
      <nav className="navbar--nav">
        <span>
          <SideBar/>
        {location.pathname === "/" &&
          <Link className="navbar--search--link" onClick={show}> <img src={search} className="search--img"/> </Link> 
        }
        </span>
        <Link className="navbar--logo--link"><img src={gymshark} className="navbar--logo"/> </Link>
        <Link to="/mycart" className="navbar--cart--link"> <img src={cart} className="navbar--cart--img"/> </Link>
      </nav>
    </>
  );
}


