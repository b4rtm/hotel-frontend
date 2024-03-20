import '../../stylesheets/register-page.css';
import Footer from '../Footer';
import Navbar from '../Navbar';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../FormField';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

    const navigateTo = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            address: '',
            city: '',
            postcode: '',
            pesel: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Wpisz imię'),
            surname: Yup.string().required('Wpisz nazwisko'),
            email: Yup.string().email('Niepoprawny adres email').required('Wpisz email'),
            phoneNumber: Yup.string().matches(/^[\d+\s]+$/, 'Niepoprawny format numeru telefonu').required('Wpisz numer telefonu'),
            address: Yup.string().required('Wpisz adres'),
            city: Yup.string().required('Wpisz miasto'),
            postcode: Yup.string().matches(/^\d{2}-\d{3}$/, 'Niepoprawny format kodu pocztowego').required('Wpisz kod pocztowy'),
            pesel: Yup.string().matches(/^\d{11}$/, 'Niepoprawny format numeru PESEL').required('Wpisz pesel'),
            password: Yup.string().required('Wpisz hasło'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Hasła muszą być takie same').required('Potwierdź hasło'),
        }),
        onSubmit: async (values) => {

            try {
                const response = await axios.post("http://localhost:8080/register", values);
                navigateTo('/login')
            } catch (error) {
                console.error("Błąd rejestracji:", error);
            }
        },
    });

    return (
        <>
            <Navbar />
            <div className='register-page'>
                <h1>Dołącz do nas!</h1>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <FormField label="name" name="Imię" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                        {formik.touched.name && formik.errors.name && <p className="error">{formik.errors.name}</p>}
                        <FormField label="surname" name="Nazwisko" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.surname} />
                        {formik.touched.surname && formik.errors.surname && <p className="error">{formik.errors.surname}</p>}
                        <FormField label="email" name="Email" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
                        <FormField label="phoneNumber" name="Numer telefonu" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phoneNumber} />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="error">{formik.errors.phoneNumber}</p>}
                        <FormField label="address" name="Adres" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.address} />
                        {formik.touched.address && formik.errors.address && <p className="error">{formik.errors.address}</p>}
                        <FormField label="city" name="Miasto" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city} />
                        {formik.touched.city && formik.errors.city && <p className="error">{formik.errors.city}</p>}
                        <FormField label="postcode" name="Kod pocztowy" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.postcode} />
                        {formik.touched.postcode && formik.errors.postcode && <p className="error">{formik.errors.postcode}</p>}
                        <FormField label="pesel" name="PESEL" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pesel} />
                        {formik.touched.pesel && formik.errors.pesel && <p className="error">{formik.errors.pesel}</p>}
                        <FormField label="password" name="Hasło" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                        {formik.touched.password && formik.errors.password && <p className="error">{formik.errors.password}</p>}
                        <FormField label="confirmPassword" name="Potwierdź hasło" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="error">{formik.errors.confirmPassword}</p>}
                        {!formik.isValidating && <button type="submit">Zarejestruj się</button>}
                        {!formik.isValid && formik.submitCount > 0 && <p className="error">Formularz zawiera błędy</p>}
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RegisterPage;
