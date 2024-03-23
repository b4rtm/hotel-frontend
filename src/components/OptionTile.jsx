import { useNavigate } from "react-router-dom";

const OptionTile = ({label, path}) => {

    const navigateTo = useNavigate();

    const navigateToPath= () => {
        navigateTo("/admin" + path)
    };
    return (
        <div className="tile" onClick={navigateToPath}>
            {label}
        </div>
    );
}

export default OptionTile;