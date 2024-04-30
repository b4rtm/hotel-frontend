import { useNavigate } from "react-router-dom";

const OptionTile = ({image, label, path}) => {

    const navigateTo = useNavigate();

    const navigateToPath= () => {
        navigateTo("/admin" + path)
    };
    return (
        <div className="tile" onClick={navigateToPath}>
            <div className="title">
                {label}
            </div>
            <img src={image} />
        </div>
    );
}

export default OptionTile;