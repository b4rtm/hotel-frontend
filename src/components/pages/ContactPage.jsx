import { useTranslation } from "react-i18next";
import Footer from "../Footer";
import Navbar from "../Navbar";


const ContactPage = () => {

    const { t } = useTranslation();


    return (
        <>
            <Navbar />
                <div className="contact-page">
                    <h1>{t('contactUs')}</h1>
                    <p>{t('contactMessage')}</p>
                    <p>{t('contactInfoDescription')}</p>
                    <p>{t('ourAddress')}</p>
                    <p>{t('phone')}</p>
                    <p>{t('ourEmail')}</p>
                </div>
            <Footer />
        </>
    );
}

export default ContactPage;