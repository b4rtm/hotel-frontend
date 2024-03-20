import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/room-desc.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';

registerLocale('pl', pl);

const RoomDescriptionPage = () =>{

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reservedDates, setReservedDates] = useState(null);
    const [overlapError, setOverlapError] = useState(false);
    const { id } = useParams();
    const [room, setRoom] = useState();
  
    const handleStartDateChange = date => {
      setStartDate(date);
      setOverlapError(false);
    };

    const isBetweenDates = (dateStart, dateEnd, date) =>  date > dateStart && date < dateEnd;
  
    const handleEndDateChange = (date) => {
      setEndDate(date);
      const overlap = reservedDates.some(reservedDate => isBetweenDates(startDate, date, reservedDate));
      setOverlapError(overlap);
    };


    useEffect(() => {
        const fetchRoom = async () => {
            try {

                const url = 'http://localhost:8080/rooms/' + id
                const response = await axios.get(url);
                setRoom(response.data);
                const generateDatesBetween = (checkInDate, checkOutDate) => {
                    const dates = [];
                    const currentDay = new Date(checkInDate);
                    while (currentDay <= checkOutDate) {
                      dates.push(new Date(currentDay));
                      currentDay.setDate(currentDay.getDate() + 1);
                    }
                    return dates;
                  };
          
                  const parsedDates = response.data.bookings.flatMap(booking =>
                    generateDatesBetween(
                      new Date(booking.checkInDate.join('-')),
                      new Date(booking.checkOutDate.join('-'))
                    )
                  );
                  setReservedDates(parsedDates);

            } catch (error) {
                console.error('Error fetching room:', error);
            }
        };

        fetchRoom();
    }, []); 


    const handleReservation = async () => {
        try {
            const response = await axios.post('http://localhost:8080/bookings', {
                checkInDate: startDate,
                checkOutDate: endDate,
                roomId: room.id,
                customerId: "1"
            });

        } catch (error) {
            console.error('Error booking room:', error);
        }
    };

    return (
        <>
            <Navbar/>
            <div className='room-desc'>
                <div className='first-row'>
                    <img src={room?.imagePath} />
                    <h1>{room?.name}</h1>
                    
                </div>
                <div className='second-row'>
                    <p>{room?.description}</p>
                    <p>{room?.pricePerNight} zł na noc</p>
                    <p>{room?.capacity} {room?.capacity === 1 ? 'osoba' : 'osoby'}</p>
                    
                    <div>
                        <h2>Wybierz datę początku i końca rezerwacji:</h2>
                        <div>
                            <label>Początek rezerwacji:</label>
                            <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Wybierz datę początku"
                            excludeDates={reservedDates}
                            locale="pl"
                            />
                        </div>
                        <div>
                            <label>Koniec rezerwacji:</label>
                            <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Wybierz datę końca"
                            excludeDates={reservedDates}
                            locale="pl"
                            />
                        </div>
                        {overlapError && <p style={{ color: 'red' }}>Wybrana data przecina się z wcześniej zarezerwowaną datą.</p>}
                    </div>
                    <button onClick={handleReservation}>Rezerwuj</button>

                </div>
            </div>
            <Footer/>
        </>
    );
}

export default RoomDescriptionPage;