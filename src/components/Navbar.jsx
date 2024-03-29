import '../stylesheets/navbar.css'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import i18next from 'i18next';
import '../translations/i18n'

const Navbar = ({language}) =>{

  const { t } = useTranslation();

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  return (
    <div className="navbar">
       <Link to="/">
        <img className="logo" src="/logo.png" alt="Logo"/>
      </Link>
      <Link to="/rooms" className='navbar-item'>
        {t('rooms')}
      </Link>
      <div className='navbar-item'>
        {t('contact')}
      </div>
      <Link to="/login" className='navbar-item'>
        {t('login')}
      </Link>
      <Link to="/register" className='navbar-item'>
        {t('register')}
      </Link>
    </div>
);
    
}

export default Navbar;