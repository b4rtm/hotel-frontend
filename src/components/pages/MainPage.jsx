import ReservationPanel from "../ReservationPanel";
import '../../stylesheets/main-page.css'
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useState } from "react";

function MainPage(){

    const [language, setLanguage] = useState("pl")

    return (
        <>
            <Navbar language={language}/>
            <div className="main-page">
                <img src="lobby2.jpg" className="main-img"></img>
                <div className="select-lang">
                    <div className="lang-icon" onClick={() => setLanguage('pl')}><img src="/poland-flag-icon.png" alt="PL" /></div>
                    <div className="lang-icon" onClick={() => setLanguage('en')}><img src="/uk-flag-icon.png" alt="EN" /></div>
                </div>
                <ReservationPanel />
            </div>
            <Footer language={language}/>
        </>
      );
    
}

export default MainPage;