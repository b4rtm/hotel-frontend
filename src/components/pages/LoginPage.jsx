import { useEffect, useState } from 'react';
import '../../stylesheets/register-page.css';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUser } from '../../api/users';
import FastFormField from '../FastFormField';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const navigateTo = useNavigate();
    const location = useLocation();

    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [googleLoginError, setGoogleLoginError] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const message = queryParams.get('message');
        if (message === 'activate') {
            setInfoMessage('Twoje konto zostało zarejestrowane. Aby się zalogować, musisz aktywować swoje konto klikając w link aktywacyjny wysłany na Twój e-mail.');
        }
    }, [location.search]);

    const handleGoogleLoginSuccess = (response) => {
       
      };
    
    
      const handleGoogleLoginError = (response) => {
       
      };

    return (
        <>
            <Navbar />
            <div className='register-page'>
                <h1>Zaloguj się!</h1>
                {infoMessage && <p className="error">{infoMessage}</p>}
                <div>
                    <div>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                    />
                    </div>
                    {googleLoginError && <div>{googleLoginError}</div>}
                </div>
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
