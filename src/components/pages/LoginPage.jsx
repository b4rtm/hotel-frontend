import { useState } from 'react';
import '../../stylesheets/register-page.css'
import Footer from '../Footer';
import FormField from '../FormField';
import Navbar from '../Navbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () =>{

    const navigateTo = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Wpisz email'),
            password: Yup.string().required('Wpisz hasło'),
        }),
        onSubmit: async (values) => {
            
            try {
                const response = await axios.post("http://localhost:8080/auth/login", values);
                localStorage.setItem('token', response.data.token);
                navigateTo('/')
              }
              catch (error) {
                  if (error.response.status === 401) {
                    setErrorMessage('Niepoprawny email lub hasło.');
                }
              }
        },
    });


    return (
        <>
        <Navbar/>
        <div className='register-page'>
            <h1>Zaloguj się!</h1>
            <form onSubmit={formik.handleSubmit}>
                <FormField label="username" name="Email" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
                {formik.touched.username && formik.errors.username && <p className="error">{formik.errors.username}</p>}
                <FormField label="password" name="Hasło" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                {formik.touched.password && formik.errors.password && <p className="error">{formik.errors.password}</p>}
                {!formik.isValidating && <button type="submit">Zaloguj się</button>} 
                {errorMessage && <p className="error">{errorMessage}</p>}           
                {!formik.isValid && formik.submitCount > 0 && <p className="error">Wypełnij formularz logowania</p>}
            </form>
        </div>
        <Footer/>
    </>
    );
}

export default LoginPage;