import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { fetchBooking } from "../../api/bookings";
import { useParams } from "react-router-dom";
import { formatDate } from "../../api/date";
import { useTranslation } from "react-i18next";

const SummaryPage = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const bookingData = await fetchBooking(bookingId);
      setBooking(bookingData);
    };
    fetchData();
  }, [bookingId]);

  return (
    <>
      <Navbar />
      {booking && (
        <div className="summary-container">
          <h1>{t("reservationSummary")}</h1>
          <p>
            {t("reservationId")}: {booking.id}
          </p>
          <p>
            {t("reservedBy")}: {booking.customer.name}{" "}
            {booking.customer.surname}
          </p>
          <p>
            {t("startDate")}: {formatDate(booking.checkInDate)}
          </p>
          <p>
            {t("endDate")}: {formatDate(booking.checkOutDate)}
          </p>
          <p>
            {t("roomName")}: {booking.room.name}
          </p>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SummaryPage;
