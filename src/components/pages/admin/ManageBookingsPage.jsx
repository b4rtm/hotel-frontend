import { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  approveBooking,
  deleteBooking,
  fetchBookings,
  generateDatesBetween,
  postBooking,
} from "../../../api/bookings";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import {
  formatDate,
  handleEndDateChange,
  handleStartDateChange,
} from "../../../api/date";
import { fetchRoom, fetchRooms } from "../../../api/rooms";
import FormField from "../../FormField";
import { fetchUsers } from "../../../api/users";
import { Link } from "react-router-dom";

registerLocale("pl", pl);

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservedDates, setReservedDates] = useState(null);
  const [overlapError, setOverlapError] = useState(false);

  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      const roomsData = await fetchRooms();
      setRooms(roomsData);
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const handleOpenConfirmation = (bookingId) => {
    setIsConfirmationOpen(true);
    setSelectedBookingId(bookingId);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmDeleteBooking = () => {
    handleCloseConfirmation();
    handleDeleteBooking(selectedBookingId);
  };

  const handleDeleteBooking = async (bookingId) => {
    deleteBooking(bookingId);
    location.reload();
  };

  const handleRoomChange = async (event) => {
    const roomId = parseInt(event.target.value);
    const room = rooms.find((room) => room.id === roomId);

    const newRoom = await fetchRoom(room.id);
    setSelectedRoom(newRoom);

    const parsedDates = newRoom.bookings.flatMap((booking) =>
      generateDatesBetween(
        new Date(booking.checkInDate.join("-")),
        new Date(booking.checkOutDate.join("-"))
      )
    );
    setReservedDates(parsedDates);
  };

  const addBooking = () => {
    const user = users.find((user) => user.email == email);

    const startDateWithAddedDay = new Date(startDate);
    startDateWithAddedDay.setDate(startDateWithAddedDay.getDate() + 1);
    const formattedStartDate = startDateWithAddedDay
      .toISOString()
      .split("T")[0];

    const endDateWithAddedDay = new Date(endDate);
    endDateWithAddedDay.setDate(endDateWithAddedDay.getDate() + 1);
    const formattedEndDate = endDateWithAddedDay.toISOString().split("T")[0];

    postBooking({
      customerId: user.id,
      roomId: selectedRoom.id,
      checkInDate: formattedStartDate,
      checkOutDate: formattedEndDate,
    });
    location.reload();
  };

  const handleApproveBooking = async (bookingId) => {
    approveBooking(bookingId);
    location.reload();
  };

  const pendingBookings = bookings.filter((booking) => !booking.isApproved);
  const approvedBookings = bookings.filter((booking) => booking.isApproved);

  return (
    <div className="manage-page">
      <h1>Zarządzaj rezerwacjami</h1>
      <Link
        to="/login"
        className="logout-button"
        onClick={() => localStorage.removeItem("token")}
      >
        Wyloguj
      </Link>

      <div className="content">
        <div className="bookings-list">
          <h2>Rezerwacje do zatwierdzenia</h2>
          <div className="fields">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data rozpoczęcia</th>
                  <th>Data zakończenia</th>
                  <th>ID klienta</th>
                  <th>ID pokoju</th>
                  <th>Usuń</th>
                  <th>Zatwierdź</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking, index) => (
                  <tr key={index} className="info">
                    <td>{booking.id}</td>
                    <td>{formatDate(booking.checkInDate)}</td>
                    <td>{formatDate(booking.checkOutDate)}</td>
                    <td>{booking.customer.id}</td>
                    <td>{booking.room.id}</td>
                    <td>
                      <svg
                        onClick={() => handleOpenConfirmation(booking.id)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                        fill="black"
                      >
                        <title>Usuń</title>
                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                      </svg>
                    </td>
                    <td>
                      <img
                        onClick={() => handleApproveBooking(booking.id)}
                        className="icon"
                        src="/check.png"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Zatwierdzone rezerwacje</h2>
          <div className="fields">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data rozpoczęcia</th>
                  <th>Data zakończenia</th>
                  <th>ID klienta</th>
                  <th>ID pokoju</th>
                </tr>
              </thead>
              <tbody>
                {approvedBookings.map((booking, index) => (
                  <tr key={index} className="info">
                    <td>{booking.id}</td>
                    <td>{formatDate(booking.checkInDate)}</td>
                    <td>{formatDate(booking.checkOutDate)}</td>
                    <td>{booking.customer.id}</td>
                    <td>{booking.room.id}</td>
                    <td>
                      <svg
                        onClick={() => handleOpenConfirmation(booking.id)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                        fill="black"
                      >
                        <title>Usuń</title>
                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="register-page">
          <form>
            <div className="form-field">
              <label>Wybierz pokój:</label>
              <select
                style={{ fontSize: "20px" }}
                value={selectedRoom ? selectedRoom.id : ""}
                onChange={handleRoomChange}
              >
                <option value="">
                  {selectedRoom ? selectedRoom.name : "Wybierz pokój"}
                </option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Początek rezerwacji:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) =>
                  handleStartDateChange(date, setStartDate, setOverlapError)
                }
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                excludeDates={reservedDates}
                locale="pl"
              />
            </div>
            <div className="form-field">
              <label>Koniec rezerwacji:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) =>
                  handleEndDateChange(
                    date,
                    setEndDate,
                    setOverlapError,
                    startDate,
                    reservedDates
                  )
                }
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                excludeDates={reservedDates}
                locale="pl"
              />
            </div>
            <FormField
              label="email"
              name="E-mail"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button onClick={addBooking}>Dodaj rezerwację</button>
          </form>
        </div>
      </div>
      <Modal
        className="modal"
        isOpen={isConfirmationOpen}
        onRequestClose={handleCloseConfirmation}
      >
        <p>Czy na pewno chcesz usunąć rezerwację?</p>
        <button
          className="delete"
          onClick={() => handleConfirmDeleteBooking(selectedBookingId)}
        >
          Tak
        </button>
        <button onClick={handleCloseConfirmation}>Anuluj</button>
      </Modal>
    </div>
  );
};

export default ManageBookingsPage;
