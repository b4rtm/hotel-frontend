import ReservationPanelTile from './ReservationPanelTile'
import '../stylesheets/main-page.css'

function ReservationPanel(){

    const currentDate = new Date(); 
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
      return (
        

        <div className="reservation-panel">
            <ReservationPanelTile className='reservation-panel-tile' initialDate={currentDate.toLocaleDateString()}/>
            <ReservationPanelTile className='reservation-panel-tile' initialDate={tomorrowDate.toLocaleDateString()}/>
        </div>
      );
    
}

export default ReservationPanel;