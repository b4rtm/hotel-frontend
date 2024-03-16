import { useState } from 'react';
import '../../stylesheets/register-page.css'
import Footer from '../Footer';
import FormField from '../FormField';
import Navbar from '../Navbar';
const RegisterPage = () =>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8080/login", {
              email,
              password
            });
            navigateTo('/')
          }
          catch (error) {
              console.error("login error:", error);
          }
    }

    return (
        <>
        <Navbar/>
        <div className='register-page'>
            <h1>Zaloguj się!</h1>
            <form>
                <FormField label="email" name="E-mail" type="text" onChange={(e) => setEmail(e.target.value)}/>
                <FormField label="password" name="Hasło" type="password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" onClick={handleLogin}>Zaloguj się</button>
            </form>
        </div>
        <Footer/>
    </>
    );
}

export default RegisterPage;