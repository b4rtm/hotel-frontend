import OptionTile from "../../OptionTile";
import "../../../stylesheets/admin-main-page.css"

const AdminMainPage = () => {

    return (
        <div className="admin-main-page">
            <h1>Panel administratora</h1>
            <div className="options">
                <OptionTile image="/user.png" label="Zarządzaj użytkownikami" path="/users"></OptionTile>
                <OptionTile image="calendar.png" label="Zarządzaj rezerwacjami" path="/bookings"></OptionTile>
                <OptionTile image="bed.png" label="Zarządzaj pokojami" path="/rooms"></OptionTile>
            </div>
        </div>
    );

}

export default AdminMainPage;