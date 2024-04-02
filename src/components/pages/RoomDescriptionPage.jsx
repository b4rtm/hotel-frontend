import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/room-desc.css'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
import { fetchRoom } from '../../api/rooms';
import { generateDatesBetween, postBooking } from '../../api/bookings';
import { handleEndDateChange, handleStartDateChange } from '../../api/date';
import { fetchUser } from '../../api/users';

registerLocale('pl', pl);

const RoomDescriptionPage = () =>{

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reservedDates, setReservedDates] = useState(null);
    const [overlapError, setOverlapError] = useState(false);
    const { id } = useParams();
    const [room, setRoom] = useState();
    const [user, setUser] = useState();
    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () =>{
            const roomData = await fetchRoom(id);
            setRoom(roomData);
            const userData = await fetchUser();
            setUser(userData);
        }
        fetchData();
       
    }, []);
    
    useEffect(() => {
        if (room && room.bookings) {
            const parsedDates = room.bookings.flatMap(booking =>
                generateDatesBetween(
                    new Date(booking.checkInDate.join('-')),
                    new Date(booking.checkOutDate.join('-'))
                )
            );
            setReservedDates(parsedDates);
        }
    }, [room]);

    const handleReservation = async () => {
        if(!user){
            localStorage.setItem('redirectPath', `/rooms/${id}`);
            navigateTo('/login');
        }
        postBooking({
            checkInDate: startDate,
            checkOutDate: endDate,
            roomId: room.id,
            customerId: user?.id
        })
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
                            onChange={(date) => handleStartDateChange(date, setStartDate, setOverlapError)}
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
                            onChange={(date) => handleEndDateChange(date, setEndDate, setOverlapError, startDate, reservedDates)}
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