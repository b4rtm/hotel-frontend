import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { fetchBooking } from "../../api/bookings";
import { useParams } from "react-router-dom";


const SummaryPage = () => {

    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);


    useEffect(() =>{
        const fetchData = async () => {
           const bookingData =  await fetchBooking(bookingId);
           setBooking(bookingData);
        }
       fetchData();
       console.log(booking)
    }, [bookingId])

    return (
        <>
        <Navbar/>
        {booking && (
            <div className="summary-container">
                <h1>Podsumowanie rezerwacji</h1>
                <p>ID rezerwacji: {booking.id}</p>
                <p>Zarezerwowane przez: {booking.customer.name} {booking.customer.surname}</p>
                <p>Data początku: {booking.checkInDate}</p>
                <p>Data końca: {booking.checkOutDate}</p>
                <p>Nazwa pokoju: {booking.room.name}</p>
            </div>
        )}
        <Footer/>
        </>
    )
}

export default SummaryPage;