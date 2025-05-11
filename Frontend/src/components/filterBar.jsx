/* eslint-disable react/prop-types */
import "../styles/filerbar.css"
import axios from "axios";
import { useState } from "react";
import "../styles/productpage.css"
const url = import.meta.env.VITE_BACKEND_URL;
import InfoHover from "./infoHover";

export default function FilterBar({filterProducts}) {
    const [selectedSizes, setSelectedSizes] = useState([]);
    const buttons = document.querySelectorAll('.size--button--filter');
    const [isFilter, setIsFilter] = useState(false);

    const handleSizeFilter = (event) => {
        const size = event.target.value;

        const button = event.target;
        if(selectedSizes.includes(size)){
            setSelectedSizes(selectedSizes.filter(item => item !== size));

                    button.style.backgroundColor = ''; 
                    button.style.borderColor = ''; 
                    button.style.color = ''; 
            
            if (selectedSizes.length === 1) {  
                filterProducts([]);
            }
            return;
        }
        setSelectedSizes(prevSizes=>[...prevSizes,size])
        button.style.backgroundColor = '#000'; 
        button.style.borderColor = '#000'; 
        button.style.color = '#fff';             
       
    }

    const clearFilter = () =>{
        setSelectedSizes([]);
        buttons.forEach(button=>{
            button.style.backgroundColor = ''; 
            button.style.borderColor = ''; 
            button.style.color = ''; 
        
        })
        filterProducts([]);
    }

    async function filter(){
        if (selectedSizes.length === 0) {
            setIsFilter(true);
            return;
        }
        await axios.post(`${url}/products/filter`, { FilterSize:selectedSizes }, { withCredentials: true })
        .then((response) => {
            filterProducts([...response.data]);
        })
        .catch((error) => { console.log(error); })
    }

    return (
        <>
        <InfoHover error={true} open={isFilter} close={ ()=>setIsFilter(false) }  title={"Choose a filter"} body={"you have to pick a size or more to filter upon!!"} />
            <div className="size-filter">
                <span className="size--filter--span">
                    <button className='size--button--filter' value ="S" onClick={ handleSizeFilter}>S</button>
                    <button className='size--button--filter' value ="M" onClick={ handleSizeFilter}>M</button>
                    <button className='size--button--filter' value ="L" onClick={ handleSizeFilter}>L</button>
                    <button className='size--button--filter' value ="XL" onClick={ handleSizeFilter}>XL</button>
                    <button className='size--button--filter' value ="XXL" onClick={ handleSizeFilter}>XXL</button>
                </span>
                <span className="filter--buttons--span">
                    <button className='filter--button' onClick={() => filter() }>Filter</button>
                    <button className='filter--button' onClick={() => clearFilter() }>Clear</button>
                </span>
            </div>
        </>
    )
}