import OptionTile from "../OptionTile";
import "../../stylesheets/admin-main-page.css"

const AdminMainPage = () => {

    return (
        <div className="admin-main-page">
            <h1>Panel administratora</h1>
            <div className="options">
                <OptionTile label="Zarządzaj użytkownikami" path="/users"></OptionTile>
                <OptionTile label="Zarządzaj rezerwacjami"></OptionTile>
                <OptionTile label="Zarządzaj pokojami"></OptionTile>
            </div>
        </div>
    );

}

export default AdminMainPage;