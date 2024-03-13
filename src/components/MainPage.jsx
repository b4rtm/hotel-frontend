import ReservationPanel from "./ReservationPanel";
import '../stylesheets/main-page.css'

function MainPage(){
    return (
        <div className="main-page">
            <img src="lobby2.jpg" className="main-img"></img>
            <ReservationPanel />
        </div>
      );
    
}

export default MainPage;