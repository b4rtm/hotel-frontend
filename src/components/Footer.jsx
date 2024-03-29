import '../stylesheets/main-page.css'
import '../stylesheets/footer.css'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import i18next from 'i18next';
import '../translations/i18n'

function Footer({language}) {

    const { t } = useTranslation();

    useEffect(() => {
      i18next.changeLanguage(language);
    }, [language]);

    return (
        <div className="footer">
            <div className='footer-column'>
                <h1>Royal Residence</h1>
                <div className='footer-content'>
                    <p>{t('address')}</p>
                    <p>{t('phone')}</p>
                    <p>{t('email')}</p>
                </div>
            </div>
            <div className='footer-column'>
                <h1>{t('aboutUsTitle')}</h1>
                <div className='footer-content'>
                   <p>{t('aboutUsText')}</p>
                </div>
            </div>
            <div className='footer-column'>
                <h1>{t('quickLinksTitle')}</h1>
                <div className='footer-content'>
                    <p>{t('rooms')}</p>
                    <p>{t('login')}</p>
                    <p>{t('contact')}</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
