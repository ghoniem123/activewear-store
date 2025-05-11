/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductCard from '../components/productCard';
import { useState, useEffect } from 'react'; 
import axios from 'axios';
const url = import.meta.env.VITE_BACKEND_URL;
import '../style.css';
import '../styles/productpage.css';
import Navbar from '../components/navbar';
import FilterBar from '../components/filterBar';

export default function ProductsPage (){
    const [products, setProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(()=>
    {  

      async function getProducts(){

        await axios.get(`${url}/products` ,{withCredentials:true}).then((response) => {
  
          setProducts([...response.data]); 
          
        }).catch((error) => { console.log(error); })
  
      }

    getProducts();
    },[]); 

return (
  <>
  <Navbar filterbar={setIsVisible} visible={isVisible}/>

  {isVisible && <FilterBar filterProducts={setFilteredProducts}/>}
  
  {  filteredProducts.length > 0 &&
  <div className="product--page--div">
      {filteredProducts.map(filteredproduct => <ProductCard key={filteredproduct._id} {...filteredproduct}/> )} 
  </div>
  }

  { filteredProducts.length === 0 &&
  <div className="product--page--div">
      {products.map(product => <ProductCard key={product._id} {...product}/> )} 
  </div> 
  }
  </>
)
}
