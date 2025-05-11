
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import '../styles/infopage.css';
import InfoHover from '../components/infoHover';

export default function InformationPage() {
        const [countries, setCountries] = useState([]);
        const nagivate = useNavigate();
        const [isVisible, setVisible] = useState(false);
        const [isValidEmail, setValidEmail] = useState(false);
        const [isPhoneValid, setPhoneValid] = useState(false);

        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryNames = data.map(country => country.name.common);
                countryNames.sort();
                const filteredCountryNames = countryNames.filter(country => country !== "Christmas Island");
                setCountries(filteredCountryNames);
            })
            .catch(error => console.log('Error:', error));


        function pay() {
            const inputs = document.querySelectorAll('.info--input');
            const isFilled = Array.from(inputs).every(input => input.value.trim() !== '');
            const isEmailValid = inputs[2]?.value?.includes('@') && inputs[2]?.value?.includes('.com');
            const phone_number_input = document.querySelector('.info--input--phone');
            const phone_code_input = document.querySelector('.info--input--code');
            const country_input = document.querySelector('.info--input--country');
            const isCountrySelected = country_input?.value !== '';

            const isPhoneValid = phone_number_input?.value?.trim() !== '';
            const isPhoneCodeValid = phone_code_input?.value?.trim() !== '';

            if (isFilled && isEmailValid && isPhoneValid && isPhoneCodeValid && isCountrySelected) {
                const cartId = window.sessionStorage.getItem('cartid');
                window.sessionStorage.clear();
                window.sessionStorage.setItem('cartid', cartId);
                window.sessionStorage.setItem('email', inputs[2]?.value);
                window.sessionStorage.setItem('first_name', inputs[0]?.value);
                window.sessionStorage.setItem('last_name', inputs[1]?.value);
                window.sessionStorage.setItem('country', country_input?.value);
                window.sessionStorage.setItem('address_line1', inputs[3]?.value);
                window.sessionStorage.setItem('address_line2', inputs[4]?.value);
                window.sessionStorage.setItem('city', inputs[5]?.value);
                window.sessionStorage.setItem('phone_number', phone_code_input?.value + " " + phone_number_input?.value);

                console.log('Email:', inputs[2]?.value);
                        console.log('First Name:', inputs[0]?.value);
                        console.log('Last Name:', inputs[1]?.value);
                        console.log('Country:', country_input?.value);
                        console.log('Address Line 1:', inputs[3]?.value);
                        console.log('Address Line 2:', inputs[4]?.value);
                        console.log('City:', inputs[5]?.value);
                        console.log('Phone Number:', phone_code_input?.value + " " + phone_number_input?.value);
                
                nagivate("/pay");
            } else {
                if (!isFilled || !isPhoneValid || !isPhoneCodeValid || !isCountrySelected) {
                   setVisible(true);
                } else if (!isEmailValid) {
                   setValidEmail(true);
                }else if ( isNaN(parseInt(phone_number_input?.value)) || isNaN(parseInt(phone_code_input?.value)) ) {
                    setPhoneValid(true);
                }
            }
        }
            

    return (
        <>
        <InfoHover error={true} open={isVisible} close={ ()=>setVisible(false) }  title={"Fill all the Info"} body={"Please fill all the info fields !!"} />
        <InfoHover error={true} open={isValidEmail} close={()=>setValidEmail(false)} title={"please enter a valid email"} body={"Like exampleXXX@gmail.com"} />
        <InfoHover error={true} open={isPhoneValid} close={()=>setPhoneValid(false)} title={"please enter a valid phone number"} body={"Like 02 1234567890"} />
        <NavBar/>
        <div className="info--div">
            <h1 className="info--title">BILLING ADDRESS</h1>

            <form className="info--form">
                <p className="info--text">First Name</p>
                <input className="info--input" type="text" placeholder="First Name" />
                <p className="info--text">Last Name</p>
                <input className="info--input" type="text" placeholder="Last Name" />
                <p className="info--text">Email</p>
                <input className="info--input" type="email" placeholder="example1234@gmail.com" />

                <p className="info--text">Country</p>
                <select className="info--input--country">
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                <p className="info--text">Address Line 1</p>
                <input className="info--input" type="text" placeholder="House number and Street" />

                <p className="info--text">Address Line 2</p>
                <input className="info--input" type="text" placeholder="Apartment, Floor, Unit etc" />

                <p className="info--text">City</p>
                <input className="info--input" type="text" placeholder="City" />

                <p className="info--text">Phone Number</p>
                <span className='phone_code'>+ </span><input className="info--input--code" type="text" placeholder=" xxx" />
                <input className="info--input--phone" type="text" placeholder="xxxxxxxx" />


            </form>
            <button className="info--button" onClick={()=>{pay()} }>CONTINUE</button>
        </div>
        </>
    );
}
