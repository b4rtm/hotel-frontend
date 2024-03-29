import '../../../stylesheets/register-page.css';
import { useEffect, useState } from "react";
import "../../../stylesheets/admin-main-page.css"
import Modal from 'react-modal';
import { deleteBooking, fetchBookings, generateDatesBetween, postBooking } from '../../../api/bookings';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
import { formatDate, handleEndDateChange, handleStartDateChange } from '../../../api/date';
import { fetchRoom, fetchRooms } from '../../../api/rooms';
import FormField from '../../FormField';
import { fetchUsers } from '../../../api/users';

registerLocale('pl', pl);


const ManageBookingsPage = () => {

    const [bookings, setBookings] = useState([])
    const [rooms, setRooms] = useState([])
    const [users, setUsers] = useState([])
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reservedDates, setReservedDates] = useState(null);
    const [overlapError, setOverlapError] = useState(false);

    const [email, setEmail] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const bookingsData = await fetchBookings();
            setBookings(bookingsData);
            const roomsData = await fetchRooms();
            setRooms(roomsData);
            const usersData = await fetchUsers();
            setUsers(usersData);
        }
        fetchData();
    }, [])
    
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
        const room = rooms.find(room => room.id === roomId);

        const newRoom = await fetchRoom(room.id)
        console.log(newRoom)
        setSelectedRoom(newRoom);

        const parsedDates = newRoom.bookings.flatMap(booking =>
            generateDatesBetween(
                new Date(booking.checkInDate.join('-')),
                new Date(booking.checkOutDate.join('-'))
            )
        );
        setReservedDates(parsedDates);
      };

      const addBooking = () =>{
        const user = users.find(user => user.email == email)
        postBooking({
            customerId : user.id,
            roomId : selectedRoom.id,
            checkInDate : startDate,
            checkOutDate : endDate
        })
        location.reload();
      }

    
    return (
        <div className='manage-page'>
            <h1>Zarządzaj rezerwacjami</h1>

            <div className="content">
                <div className="fields">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data ropoczęcia</th>
                            <th>Data zakończenia</th>
                            <th>ID klienta</th>
                            <th>ID pokoju</th>
                        </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={index + 1} className='info'>
                                    <td>
                                        <p>{booking.id}</p>
                                    </td>
                                    <td>
                                        <p>{formatDate(booking.checkInDate)}</p>
                                    </td>
                                    <td>
                                        <p>{formatDate(booking.checkOutDate)}</p>
                                    </td>
                                    <td>
                                        <p>{booking.customer.id}</p>
                                    </td>
                                    <td>
                                        <p>{booking.room.id}</p>
                                    </td>
                                    <td>
                                        <svg onClick={() => handleOpenConfirmation(booking.id)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="2em" height="2em" viewBox="0 0 24 24" fill="black"><title>Usuń</title>
                                            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
               
                <div className="register-page">
                    <div className="form-field">
                        <label>Wybierz pokój:</label>
                            <select value={selectedRoom ? selectedRoom.id : ""} onChange={handleRoomChange}>
                            <option value="">{selectedRoom ? selectedRoom.name : "Wybierz pokój"}</option>
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
                        onChange={(date) => handleStartDateChange(date, setStartDate, setOverlapError)}
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
                        onChange={(date) => handleEndDateChange(date, setEndDate, setOverlapError, startDate, reservedDates)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="dd/MM/yyyy"
                        excludeDates={reservedDates}
                        locale="pl"
                        />
                    </div>
                    <FormField label="email" name="E-mail" type="text" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <button onClick={addBooking}>Dodaj rezerwację</button>
                </div>
            </div>
            <Modal className="modal" isOpen={isConfirmationOpen} onRequestClose={handleCloseConfirmation}>
                <p>Czy na pewno chcesz usunąć rezerwację?</p>
                <button className="delete" onClick={() => handleConfirmDeleteBooking(selectedBookingId)}>Tak</button>
                <button onClick={handleCloseConfirmation}>Anuluj</button>
            </Modal>
    </div>
    );
}

export default ManageBookingsPage;