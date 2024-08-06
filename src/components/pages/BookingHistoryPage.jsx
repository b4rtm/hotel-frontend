import Footer from "../Footer";
import Navbar from "../Navbar";
import { fetchUserBookings, deleteBooking } from "../../api/bookings";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { formatDate } from "../../api/date";
import { fetchRooms } from "../../api/rooms";
import Modal from 'react-modal';
import '../../stylesheets/booking-history.css';
import { Rating, TextareaAutosize } from "@mui/material";
import { postReview } from "../../api/reviews";

const BookingHistoryPage = () => {
    const { userId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const getBookings = async () => {
            const data = await fetchUserBookings(userId);
            console.log(data);
            setBookings(data);
            const roomsData = await fetchRooms();
            setRooms(roomsData);
        };
        getBookings();
    }, [userId]);

    const isReviewable = (checkOutDate) => {
        const today = new Date();
        const checkOut = new Date(checkOutDate[0], checkOutDate[1] - 1, checkOutDate[2]);
        return today >= checkOut;
    };

    const openModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setReview('');
        setRating(0);
    };

    const handleAddReview = async () => {
        console.log(bookings);
        console.log(`Dodaj recenzję dla rezerwacji ${selectedBookingId}:`, { review, rating });

        const selectedBooking = bookings.find(booking => booking.id === selectedBookingId);

        const reviewData = {
            bookingId: selectedBookingId,
            customerId:userId,
            roomId: selectedBooking.room.id,
            comment:review,
            rating
        };
        postReview(reviewData)
        closeModal();
    };

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
                            {booking.hasReview ? (
                                <button className="added-review">Dodano opinię</button>
                            ) :
                            (isReviewable(booking.checkOutDate) && (
                                <button
                                    className="add-review-button"
                                    onClick={() => openModal(booking.id)}
                                >
                                    Dodaj opinię
                                </button>
                                ))}
                        </div>
                        <img src={booking.room.imagePaths[0]} alt={booking.room.name} />
                    </div>
                ))}
            </div>
            <Footer />

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Dodaj recenzję"
                className="modal"
                overlayClassName="review-modal-overlay"
            >
                <h2>Dodaj recenzję</h2>
                <Rating
                value={rating}
                onChange={(event, newValue) => {
                setRating(newValue);
                }}
            />
                <TextareaAutosize aria-label="minimum height" value={review} minRows={3} placeholder="Dodaj komentarz" onChange={(event) => setReview(event.target.value)}/>
                <button onClick={handleAddReview}>Dodaj recenzję</button>
                <button onClick={closeModal}>Anuluj</button>
            </Modal>
        </>
    );
};

export default BookingHistoryPage;
