import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import React, {useState} from "react";

function ReservationPanelTile({ initialDate }) {
    const [isCalendarVisible, setCalendarVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  
    const handleTileClick = () => {
      setCalendarVisibility(!isCalendarVisible);
    };
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
      setCalendarVisibility(false);
    };
  
    return (
      <div className="reservation-panel-tile">
        <div onClick={handleTileClick}>{selectedDate.toLocaleDateString()}</div>
        {isCalendarVisible && (
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            onClickDay={() => setCalendarVisibility(false)}
          />
        )}
      </div>
    );
  }

export default ReservationPanelTile;