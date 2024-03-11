import '../stylesheets/navbar.css'

function Navbar(){
    return (
        <div className="navbar">
          <div className="logo">Logo</div>
          <div className='navbar-item'>Pokoje</div>
          <div className='navbar-item'>Kontakt</div>
          <div className='navbar-item'>Logowanie</div>
          <div className='navbar-item'>Rejestracja</div>
        </div>
      );
    
}

export default Navbar;