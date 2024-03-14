import '../../stylesheets/register-page.css'
import Footer from '../Footer';
import FormField from '../FormField';
import Navbar from '../Navbar';
const RegisterPage = () =>{
    return (
        <>
        <Navbar/>
        <div className='register-page'>
            <h1>Zaloguj się!</h1>
            <form>
                <FormField label="email" name="E-mail" type="text"/>
                <FormField label="password" name="Hasło" type="password"/>
                <button type="submit">Zaloguj się</button>
            </form>
        </div>
        <Footer/>
    </>
    );
}

export default RegisterPage;