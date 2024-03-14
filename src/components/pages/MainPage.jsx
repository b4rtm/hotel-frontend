import ReservationPanel from "../ReservationPanel";
import '../../stylesheets/main-page.css'
import Navbar from "../Navbar";
import Footer from "../Footer";

function MainPage(){
    return (
        <>
            <Navbar/>
            <div className="main-page">
                <img src="lobby2.jpg" className="main-img"></img>
                <ReservationPanel />
            </div>
            <Footer/>
        </>
      );
    
}

export default MainPage;