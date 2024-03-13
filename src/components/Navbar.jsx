import '../stylesheets/navbar.css'
import { Link } from 'react-router-dom';

function Navbar(){
    return (
        <div className="navbar">
           <Link to="/">
            <img className="logo" src="logo.png"/>
          </Link>
          <div className='navbar-item'>Pokoje</div>
          <div className='navbar-item'>Kontakt</div>
          <div className='navbar-item'>Logowanie</div>
          <Link to="/register">
            <div className='navbar-item'>Rejestracja</div>
          </Link>
        </div>
      );
    
}

export default Navbar;