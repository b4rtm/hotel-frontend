import '../stylesheets/navbar.css'
import { Link } from 'react-router-dom';

function Navbar(){
    return (
        <div className="navbar">
           <Link to="/">
            <img className="logo" src="logo.png"/>
          </Link>
          <Link to="/rooms" className='navbar-item'>
          Pokoje
          </Link>
          <div className='navbar-item'>Kontakt</div>
          <Link to="/login" className='navbar-item'>
            Logowanie
          </Link>
          <Link to="/register" className='navbar-item'>
            Rejestracja
          </Link>
        </div>
      );
    
}

export default Navbar;