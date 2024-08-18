import '../stylesheets/navbar.css'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import '../translations/transations'
import { fetchUser } from '../api/users';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useNavigate } from 'react-router-dom';


const Navbar = () =>{

  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const options = [
    { value: 'myReservations', label: 'Moje rezerwacje' },
    { value: 'logout', label: 'Wyloguj' }
  ];

  const handleDropdownChange = (option) => {
    switch (option.value) {
      case 'myReservations':
        navigate('/booking-history/' + user.id);
        break;
      case 'logout':
        localStorage.removeItem('token')
        navigate('/login');
        break;
      default:
        break;
    }
  };
  useEffect(() =>{
    const fetchData = async () => {
      const userData = await fetchUser();
      setUser(userData)
    }
    fetchData();
  }, [])

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
 <div className='navbar-item'>
      <Dropdown
      className='navbar-item'
      options={options}
      onChange={handleDropdownChange}
      placeholder={`${user.name} ${user.surname}`}
    />
    </div>
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