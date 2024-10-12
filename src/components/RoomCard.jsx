import "../../stylesheets/rooms-page.css";

const RoomCard = ({ imgPath, name }) => {
  return (
    <div className="room-card">
      <img src={imgPath} />
      <p>{name}</p>
    </div>
  );
};

export default RoomCard;
