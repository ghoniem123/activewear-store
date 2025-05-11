import { useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "../styles/sidebar.css";
import menu from "../assets/menu.png";
import gymshark from "../assets/gymshark.png";



export default function SideBar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button className="sidebar--button" onClick={handleShow}>
        <img src={menu} className="search--img"/>
      </button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="sidebar--title"><Link to="/" className="navbar--logo--link"><img src={gymshark} className="navbar--logo"/> </Link></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div className='sidebar--links'>
            <span className="sidebar--link--span">
          <Link to="/" className="sidebar--link--link"><h5 className="sidebar--link">Home Page</h5></Link>
          </span>
                <span className="sidebar--link--span">
          <Link to="/track" className="sidebar--link--link"><h5 className="sidebar--link">Track Order</h5></Link>
          </span>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

