import { useState } from 'react';
import '../../stylesheets/register-page.css'
import Footer from '../Footer';
import FormField from '../FormField';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const RegisterPage = () =>{

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setTel] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pesel, setPesel] = useState('');
    const [postCode, setPostcode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const navigateTo = useNavigate();


    const handleRegister = async () => {

        if(password != confirmPassword){
            setPasswordsMatch(false);
            return;
        }

        try {
          const response = await axios.post("http://localhost:8080/register", {
            name,
            surname,
            email,
            phoneNumber,
            address,
            city,
            postCode,
            pesel,
            password
          });
          navigateTo('/login')
        }
        catch (error) {
            console.error("register error:", error);
        }
    }


    return (
        <>
        <Navbar/>
        <div className='register-page'>
            <h1>Dołącz do nas!</h1>
            <div>
                <FormField label="name" name="Imię" type="text" onChange={(e) => setName(e.target.value)}/>
                <FormField label="surname" name="Nazwisko" type="text" onChange={(e) => setSurname(e.target.value)}/>
                <FormField label="email" name="E-mail" type="text" onChange={(e) => setEmail(e.target.value)}/>
                <FormField label="tel" name="Telefon" type="tel" onChange={(e) => setTel(e.target.value)}/>
                <FormField label="address" name="Adres" type="text" onChange={(e) => setAddress(e.target.value)}/>
                <FormField label="city" name="Miasto" type="text" onChange={(e) => setCity(e.target.value)} />
                <FormField label="postcode" name="Kod pocztowy" type="text" onChange={(e) => setPostcode(e.target.value)}/>
                <FormField label="pesel" name="PESEL" type="text" onChange={(e) => setPesel(e.target.value)}/>
                <FormField label="password" name="Hasło" type="password" onChange={(e) => setPassword(e.target.value)}/>
                <FormField label="confirm_password" name="Potwierdź hasło" type="password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                {!passwordsMatch && <p>Hasła nie są zgodne</p>}
                <button type="submit" onClick={handleRegister}>Zarejestruj się</button>
            </div>
        </div>
        <Footer/>
    </>
    );
}

export default RegisterPage;