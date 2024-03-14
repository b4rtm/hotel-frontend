import '../../stylesheets/register-page.css'
import Footer from '../Footer';
import FormField from '../FormField';
import Navbar from '../Navbar';
const RegisterPage = () =>{
    return (
        <>
        <Navbar/>
        <div className='register-page'>
            <h1>Dołącz do nas!</h1>
            <form>
                <FormField label="name" name="Imię" type="text"/>
                <FormField label="surname" name="Nazwisko" type="text"/>
                <FormField label="email" name="E-mail" type="text"/>
                <FormField label="tel" name="Telefon" type="tel"/>
                <FormField label="address" name="Adres" type="text"/>
                <FormField label="city" name="Miasto" type="text"/>
                <FormField label="postcode" name="Kod pocztowy" type="text"/>
                <FormField label="password" name="Hasło" type="password"/>
                <FormField label="confirm_password" name="Potwierdź hasło" type="password"/>
                <button type="submit">Zarejestruj się</button>
            </form>
        </div>
        <Footer/>
    </>
    );
}

export default RegisterPage;