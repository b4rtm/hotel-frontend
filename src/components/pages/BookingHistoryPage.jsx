import Footer from "../Footer";
import Navbar from "../Navbar";
import { fetchUserBookings, deleteBooking } from "../../api/bookings"
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { formatDate } from "../../api/date";
import { fetchRooms} from "../../api/rooms";
import '../../stylesheets/booking-history.css'

const BookingHistoryPage = () => {
    const { userId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);


    useEffect( () => {
        const getBookings = async () => {
            const data = await fetchUserBookings(userId);
            console.log(data)
            setBookings(data);
            const roomsData = await fetchRooms();
            setRooms(roomsData);
        }
        getBookings();
    }, [userId])

    return (
        <>
            <Navbar />
                <div className="booking-history-page">
                    <h1>Twoje rezerwacje</h1>
                {bookings && bookings.map((booking, index) => (
                    <div className="booking" key={index}>
                        <div className="booking-info">
                            <p>Numer rezerwacji: {booking.id}</p>
                            <p>Data rozpoczęcia: {formatDate(booking.checkInDate)}</p>
                            <p>Data zakończenia: {formatDate(booking.checkOutDate)}</p>
                            <p>{booking.room.name}</p>
                        </div>
                        <img src={booking.room.imagePaths[0]} />
                    </div>
                ))}
                </div>
            <Footer />
        </>
    );
}

export default BookingHistoryPage;