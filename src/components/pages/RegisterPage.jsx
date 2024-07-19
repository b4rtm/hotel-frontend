import '../../stylesheets/register-page.css';
import Footer from '../Footer';
import Navbar from '../Navbar';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../FormField';
import { useNavigate } from 'react-router-dom';
import FastFormField from '../FastFormField';

const RegisterPage = () => {

    const navigateTo = useNavigate();

    return (
        <>
            <Navbar />
            <div className='register-page'>
                <h1>Dołącz do nas!</h1>
                <Formik
                    initialValues={{
                        name: '',
                        surname: '',
                        email: '',
                        phoneNumber: '',
                        address: '',
                        city: '',
                        postCode: '',
                        pesel: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required('Wpisz imię'),
                        surname: Yup.string().required('Wpisz nazwisko'),
                        email: Yup.string().email('Niepoprawny adres email').required('Wpisz email'),
                        phoneNumber: Yup.string().matches(/^[\d+\s]+$/, 'Niepoprawny format numeru telefonu').required('Wpisz numer telefonu'),
                        address: Yup.string().required('Wpisz adres'),
                        city: Yup.string().required('Wpisz miasto'),
                        postCode: Yup.string().matches(/^\d{2}-\d{3}$/, 'Niepoprawny format kodu pocztowego').required('Wpisz kod pocztowy'),
                        pesel: Yup.string().matches(/^\d{11}$/, 'Niepoprawny format numeru PESEL').required('Wpisz pesel'),
                        password: Yup.string().required('Wpisz hasło'),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Hasła muszą być takie same').required('Potwierdź hasło'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await axios.post("http://localhost:8080/auth/register", values);
                            navigateTo('/login?message=activate');
                        } catch (error) {
                            console.error("Błąd rejestracji:", error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {formik => (
                        <Form>
                            <FastFormField name="name" label="Imię" type="text" />
                            <FastFormField name="surname" label="Nazwisko" type="text" />
                            <FastFormField name="email" label="Email" type="text" />
                            <FastFormField name="phoneNumber" label="Numer telefonu" type="text" />
                            <FastFormField name="address" label="Adres" type="text" />
                            <FastFormField name="city" label="Miasto" type="text" />
                            <FastFormField name="postCode" label="Kod pocztowy" type="text" />
                            <FastFormField name="pesel" label="PESEL" type="text" />
                            <FastFormField name="password" label="Hasło" type="password" />
                            <FastFormField name="confirmPassword" label="Potwierdź hasło" type="password" />
                            <button type="submit" disabled={formik.isSubmitting}>Zarejestruj się</button>
                            {!formik.isValid && formik.submitCount > 0 && <p className="error">Formularz zawiera błędy</p>}
                        </Form>
                    )}
                </Formik>
            </div>
            <Footer />
        </>
    );
}

export default RegisterPage;
