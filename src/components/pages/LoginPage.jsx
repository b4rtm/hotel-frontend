import { useState } from 'react';
import '../../stylesheets/register-page.css'
import Footer from '../Footer';
import FormField from '../FormField';
import Navbar from '../Navbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const LoginPage = () =>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')



    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Wpisz email'),
            password: Yup.string().required('Wpisz hasło'),
        }),
        onSubmit: async (values) => {

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
        },
    });


    return (
        <>
        <Navbar/>
        <div className='register-page'>
            <h1>Zaloguj się!</h1>
            <form onSubmit={formik.handleSubmit}>
                <FormField label="email" name="Email" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
                <FormField label="password" name="Hasło" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                {formik.touched.password && formik.errors.password && <p className="error">{formik.errors.password}</p>}
                {!formik.isValidating && <button type="submit">Zaloguj się</button>}                
                {!formik.isValid && formik.submitCount > 0 && <p className="error">Wypełnij formularz logowania</p>}
            </form>
        </div>
        <Footer/>
    </>
    );
}

export default LoginPage;