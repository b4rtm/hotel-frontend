import '../../stylesheets/register-page.css';
import Footer from '../Footer';
import Navbar from '../Navbar';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FastFormField from '../FastFormField';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {

    const navigateTo = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <Navbar />
            <div className='register-page'>
                <h1>{t("join")}</h1>
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
                        name: Yup.string().required(t('enterName')),
                        surname: Yup.string().required(t('enterSurname')),
                        email: Yup.string().email(t('invalidEmail')).required(t('enterEmail')),
                        phoneNumber: Yup.string()
                          .matches(/^[\d+\s]+$/, t('invalidPhoneNumber'))
                          .required(t('enterPhoneNumber')),
                        address: Yup.string().required(t('enterAddress')),
                        city: Yup.string().required(t('enterCity')),
                        postCode: Yup.string()
                          .matches(/^\d{2}-\d{3}$/, t('invalidPostCode'))
                          .required(t('enterPostCode')),
                        pesel: Yup.string()
                          .matches(/^\d{11}$/, t('invalidPesel'))
                          .required(t('enterPesel')),
                        password: Yup.string().required(t('enterPassword')),
                        confirmPassword: Yup.string()
                          .oneOf([Yup.ref('password'), null], t('confirmPasswordMismatch'))
                          .required(t('confirmPassword')),                    })}
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
                            <FastFormField name="name" label={t("name")} type="text" />
                            <FastFormField name="surname" label={t("surname")} type="text" />
                            <FastFormField name="email" label="Email" type="text" />
                            <FastFormField name="phoneNumber" label={t("phoneNumber")} type="text" />
                            <FastFormField name="address" label={t("address")} type="text" />
                            <FastFormField name="city" label={t("city")} type="text" />
                            <FastFormField name="postCode" label={t("postCode")} type="text" />
                            <FastFormField name="pesel" label="PESEL" type="text" />
                            <FastFormField name="password" label={t("password")} type="password" />
                            <FastFormField name="confirmPassword" label={t("confirmPassword")} type="password" />
                            <button type="submit" disabled={formik.isSubmitting}>{t("register")}</button>
                            {!formik.isValid && formik.submitCount > 0 && <p className="error">{t('formErrors')}</p>}
                        </Form>
                    )}
                </Formik>
            </div>
            <Footer />
        </>
    );
}

export default RegisterPage;
