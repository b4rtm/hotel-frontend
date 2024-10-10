import OptionTile from "../../OptionTile";
import "../../../stylesheets/admin-main-page.css"
import { Link } from "react-router-dom";

const AdminMainPage = () => {

    return (
        <div className="admin-main-page">
            <h1>Panel administratora</h1>
            <Link to="/login" className="logout-button" onClick={() => localStorage.removeItem('token')}>Wyloguj</Link>

            <div className="options">
                <OptionTile image="/user.png" label="Zarządzaj użytkownikami" path="/users"></OptionTile>
                <OptionTile image="/calendar.png" label="Zarządzaj rezerwacjami" path="/bookings"></OptionTile>
                <OptionTile image="/bed.png" label="Zarządzaj pokojami" path="/rooms"></OptionTile>
                <OptionTile image="/staff.png" label="Zarządzaj personelem" path="/staff"></OptionTile>
                <OptionTile image="/timetable.png" label="Ustal grafiki personelu" path="/schedules"></OptionTile>
            </div>
        </div>
    );

}

export default AdminMainPage;