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
import RoomSlider from '../RoomSlider'
import { Rating } from '@mui/material';

registerLocale('pl', pl);

const RoomDescriptionPage = () =>{

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reservedDates, setReservedDates] = useState(null);
    const [overlapError, setOverlapError] = useState(false);
    const { id } = useParams();
    const [room, setRoom] = useState();
    const [user, setUser] = useState();
    const [isReservationAttempted, setIsReservationAttempted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsReservationAttempted(true);
        if(!user){
            localStorage.setItem('redirectPath', `/rooms/${id}`);
            navigateTo('/login');
        }
        else if(!overlapError && startDate && endDate){
            openModal();
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };
    


    return (
        <>
            <Navbar/>
            <div className='room-desc'>
                <div className='first-row'>
                    <RoomSlider room={room} />
                    <h1>{room?.name}</h1>
                </div>
                <div className='second-row'>
                    <p className='desc'>{room?.description}</p>
                    <p className='price'>{room?.pricePerNight} zł za noc</p>
                    <p className='capacity'>Pokój mieści {room?.capacity} {room?.capacity === 1 ? 'osobę' : 'osoby'}</p>
                    
                    <div className='date'>
                        <div className='pick-date'>
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
                            filterDate={(date) => {
                                return date >= new Date() && !reservedDates.includes(date);
                            }}
                            locale="pl"
                            />
                        </div>
                        <div className='pick-date'>
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
                            filterDate={(date) => {
                                return date >= new Date() && !reservedDates.includes(date);
                            }}
                            locale="pl"
                            />
                        </div>
                    </div>
                    {overlapError && <p style={{ color: 'red' }}>Wybrana data przecina się z wcześniej zarezerwowaną datą.</p>}
                    {isReservationAttempted && !startDate && !endDate && <p className='error'>Wybierz datę początku i datę końca rezerwacji.</p>}
                    <button onClick={handleReservation}>Rezerwuj</button>

                </div>
            </div>
            <div className='reviews-list'>
                <h1>Opinie o pokoju:</h1>
                {room?.reviews.map(review => (
                    <div key={review.id} className='review'>
                        <p>{review.name}</p>
                         <Rating name="read-only" value={review.rating} readOnly />
                         <p>{review.comment}</p>
                    </div>
                ))}
            </div>
            {isModalOpen && (
            <div className="modal">
                <div className="modal-content">
                    <h2>Czy na pewno chcesz zarezerwować?</h2>
                    <button onClick={closeModal} style={{backgroundColor: 'darkred', border: "red"}}>Anuluj</button>
                    <button onClick={async () => {
                        closeModal();
                        const id = await postBooking({
                            checkInDate: startDate,
                            checkOutDate: endDate,
                            roomId: room.id,
                            customerId: user?.id
                        });
                        navigateTo("/summary/" + id);
                    }}>Zarezerwuj</button>
                </div>
            </div>
        )}
            <Footer/>
        </>
    );
}

export default RoomDescriptionPage;