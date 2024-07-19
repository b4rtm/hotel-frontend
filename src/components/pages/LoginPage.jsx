import { useState } from 'react';
import '../../stylesheets/register-page.css';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../api/users';
import FormField from '../FormField';
import FastFormField from '../FastFormField';

const LoginPage = () => {
    const navigateTo = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <>
            <Navbar />
            <div className='register-page'>
                <h1>Zaloguj się!</h1>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    validationSchema={Yup.object({
                        username: Yup.string().required('Wpisz email'),
                        password: Yup.string().required('Wpisz hasło'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await axios.post("http://localhost:8080/auth/login", values);
                            localStorage.setItem('token', response.data.token);
                            const storedPath = localStorage.getItem('redirectPath');
                            const fetchedUser = await fetchUser();
                            if (storedPath) {
                                localStorage.removeItem('redirectPath'); 
                                navigateTo(storedPath); 
                            } else if (fetchedUser.role === "ROLE_ADMIN") {
                                navigateTo('/admin');
                            } else {
                                navigateTo('/');
                            }
                        } catch (error) {
                            if (error.response.status === 401) {
                                setErrorMessage('Niepoprawny email lub hasło.');
                            }
                            else if (error.response.status === 403) {
                                console.log(error)
                                setErrorMessage('Konto nie zostało aktywowane.');
                            }
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {formik => (
                        <Form>
                            <FastFormField name="username" label="Email" type="text" />
                            <FastFormField name="password" label="Hasło" type="password" />
                            <button type="submit" disabled={formik.isSubmitting}>Zaloguj się</button>
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            {!formik.isValid && formik.submitCount > 0 && <p className="error">Wypełnij formularz logowania</p>}
                        </Form>
                    )}
                </Formik>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;
