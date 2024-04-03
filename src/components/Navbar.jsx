import '../stylesheets/navbar.css'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import '../translations/transations'
import { fetchUser } from '../api/users';

const Navbar = ({language}) =>{

  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() =>{
    const fetchData = async () => {
      const userData = await fetchUser();
      setUser(userData)
    }
    fetchData();
  }, [])

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
      <Link to="/contact" className='navbar-item'>
        {t('contact')}
      </Link>
      { user ? (
        <>
          <div  className='navbar-item'>
            {t('loggedAs')} {user.email}
          </div>
          <Link to="/login" onClick={() => localStorage.removeItem('token')} className='navbar-item'>
            {t('logout')}
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className='navbar-item'>
            {t('login')}
          </Link>
          <Link to="/register" className='navbar-item'>
            {t('register')}
          </Link>
        </>
      )}
      
    </div>
  );
    
}

export default Navbar;