import "../stylesheets/navbar.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "../translations/transations";
import { fetchUser } from "../api/users";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang); // Change the language here
  };

  const options = [
    { value: "myReservations", label: t("myReservations") },
    { value: "logout", label: t("logout") },
  ];

  const handleDropdownChange = (option) => {
    switch (option.value) {
      case "myReservations":
        navigate("/booking-history/" + user.id);
        break;
      case "logout":
        localStorage.removeItem("token");
        navigate("/login");
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUser();
      setUser(userData);
    };
    fetchData();
  }, []);

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src="/logo.png" alt="Logo" />
      </Link>
      <Link to="/rooms" className="navbar-item">
        {t("rooms")}
      </Link>
      <Link to="/contact" className="navbar-item">
        {t("contact")}
      </Link>
      {user ? (
        <>
          <div className="navbar-item">
            <Dropdown
              className="navbar-item"
              options={options}
              onChange={handleDropdownChange}
              placeholder={`${user.name} ${user.surname}`}
            />
          </div>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-item">
            {t("login")}
          </Link>
          <Link to="/register" className="navbar-item">
            {t("register")}
          </Link>
        </>
      )}
        <div className="select-lang">
          <div className="lang-icon" onClick={() => handleLanguageChange('pl')}>
            <img src="/poland-flag-icon.png" alt="PL" />
          </div>
          <div className="lang-icon" onClick={() => handleLanguageChange('en')}>
            <img src="/uk-flag-icon.png" alt="EN" />
          </div>
        </div>
    </div>
  );
};

export default Navbar;
