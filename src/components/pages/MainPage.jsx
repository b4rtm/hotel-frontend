import '../../stylesheets/main-page.css';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../translations/LanguageContext';

function MainPage() {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'pl';
    setLanguage(storedLanguage);
  }, [setLanguage]);

  return (
    <>
      <Navbar />
      <div className="main-page">
        <img src="lobby2.jpg" className="main-img" alt="Lobby" />
        <div className="select-lang">
          <div className="lang-icon" onClick={() => handleLanguageChange('pl')}>
            <img src="/poland-flag-icon.png" alt="PL" />
          </div>
          <div className="lang-icon" onClick={() => handleLanguageChange('en')}>
            <img src="/uk-flag-icon.png" alt="EN" />
          </div>
        </div>
      </div>
      <div className='welcome'>
        <span>Witaj w</span>
        <span className="larger-text">Royal Residence</span>
        <span>Łódź</span>
      </div>
      <Footer />
    </>
  );
}

export default MainPage;