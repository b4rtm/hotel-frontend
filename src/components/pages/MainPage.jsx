import "../../stylesheets/main-page.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useTranslation } from "react-i18next";

function MainPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="main-page">
        <img src="lobby2.jpg" className="main-img" alt="Lobby" />
      </div>
      <div className="welcome">
        <span>{t("welcome")}</span>
        <span className="larger-text">Royal Residence</span>
        <span>Łódź</span>
      </div>
      <Footer />
    </>
  );
}

export default MainPage;
