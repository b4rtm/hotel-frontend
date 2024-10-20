import Footer from "../Footer";
import Navbar from "../Navbar";
import { fetchUserBookings, deleteBooking } from "../../api/bookings";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../../api/date";
import { fetchRooms } from "../../api/rooms";
import Modal from "react-modal";
import "../../stylesheets/booking-history.css";
import { Rating, TextareaAutosize } from "@mui/material";
import { postReview } from "../../api/reviews";
import { useTranslation } from "react-i18next";

const BookingHistoryPage = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const { t } = useTranslation();

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
    const checkOut = new Date(
      checkOutDate[0],
      checkOutDate[1] - 1,
      checkOutDate[2]
    );
    return today >= checkOut;
  };

  const [modalContent, setModalContent] = useState({
    roomName: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const openModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    const selectedBooking = bookings.find(booking => booking.id === bookingId);
    setModalContent({
      roomName: selectedBooking.room.name,
      checkInDate: formatDate(selectedBooking.checkInDate),
      checkOutDate: formatDate(selectedBooking.checkOutDate),
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setReview("");
    setRating(0);
  };

  const handleAddReview = async () => {
    console.log(bookings);
    console.log(`Dodaj recenzję dla rezerwacji ${selectedBookingId}:`, {
      review,
      rating,
    });

    const selectedBooking = bookings.find(
      (booking) => booking.id === selectedBookingId
    );

    const reviewData = {
      bookingId: selectedBookingId,
      customerId: userId,
      roomId: selectedBooking.room.id,
      comment: review,
      rating,
    };
    postReview(reviewData);
    location.reload();
    closeModal();
  };

  return (
    <>
      <Navbar />
      <div className="booking-history-page">
        <h1>{t("yourBookings")}</h1>
        {bookings &&
          bookings.map((booking, index) => (
            <div className="booking" key={index}>
              <div className="booking-info">
                <p>
                  {t("bookingNumber")}: {booking.id}
                </p>
                <p>
                  {t("startDate")}: {formatDate(booking.checkInDate)}
                </p>
                <p>
                  {t("endDate")}: {formatDate(booking.checkOutDate)}
                </p>
                <p>{booking.room.name}</p>
                {booking.hasReview ? (
                  <button className="added-review">{t("reviewAdded")}</button>
                ) : (
                  isReviewable(booking.checkOutDate) && (
                    <button
                      className="green-button"
                      onClick={() => openModal(booking.id)}
                    >
                      {t("addReview")}
                    </button>
                  )
                )}
                {booking.approved && !isReviewable(booking.checkOutDate) && (
                  <button className="green-button">
                    {t("approvedByHotel")}
                  </button>
                )}
                {!booking.approved && !isReviewable(booking.checkOutDate) && (
                  <button className="awaiting-button">
                    {t("awaitingApproval")}
                  </button>
                )}
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
        <h2>{t('reviewModalTitle')}</h2>
        <p>{`${t("reviewForRoom")} ${modalContent.roomName} ${t("forReservationFrom")} ${modalContent.checkInDate} ${t("to")} ${modalContent.checkOutDate}`}</p>
        <div className="rating-container">
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            style={{ fontSize: "48px" }}
          />
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          value={review}
          minRows={3}
          placeholder={t("enterReview")}
          onChange={(event) => setReview(event.target.value)}
          style={{ fontSize: "18px", padding: "5px" }}
        />
        <button className="modal-button" onClick={handleAddReview}>{t("submitReview")}</button>
        <button className="modal-button cancel" onClick={closeModal}>{t("cancel")}</button>
      </Modal>
    </>
  );
};

export default BookingHistoryPage;
