import Footer from "../Footer";
import Navbar from "../Navbar";
import "../../stylesheets/rooms-page.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRooms } from "../../api/rooms";
import DatePicker from "react-datepicker";
import { Slider } from "@mui/material";
import { isRoomAvailable } from "../../api/date";
import { useTranslation } from "react-i18next";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const today = new Date();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const roomsData = await fetchRooms();
      setRooms(roomsData);
    };
    fetchData();
  }, []);

  const navigateTo = useNavigate();
  const goToRoomDetails = (roomId) => {
    navigateTo("/rooms/" + roomId);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleRatingRangeChange = (event, newValue) => {
    setRatingRange(newValue);
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearchTerm = room.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMinPrice = room.pricePerNight >= priceRange[0];
    const matchesMaxPrice = room.pricePerNight <= priceRange[1];
    const matchesMinRating =
      calculateAverageRating(room.reviews) >= ratingRange[0];
    const matchesMaxRating =
      calculateAverageRating(room.reviews) <= ratingRange[1];
    const matchesCapacity =
      capacity === "" || room.capacity == parseInt(capacity);
    const matchesAvailability = isRoomAvailable(room, startDate, endDate);

    return (
      matchesSearchTerm &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinRating &&
      matchesMaxRating &&
      matchesCapacity &&
      matchesAvailability
    );
  });

  const sortedRooms = filteredRooms.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "desc") {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === "rating-high") {
      return (
        calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews)
      );
    } else if (sortOrder === "rating-low") {
      return (
        calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews)
      );
    } else {
      return 0;
    }
  });

  const getAriaValueText = (value) => {
    return `${value} ${t("currency")}`;
  };

  const roomsPerPage = 6;
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="rooms-page">
        <h1>{t("rooms")}</h1>
        <div className="main-content">
          <div className="filter-panel">
            <input
              className="search-input"
              type="text"
              placeholder={t("search")}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <label>
              {t("sortBy")}:
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="">{t("selectOption")}</option>
                <option value="asc">{t("ascending")}</option>
                <option value="desc">{t("descending")}</option>
                <option value="rating-high">{t("ratingHigh")}</option>
                <option value="rating-low">{t("ratingLow")}</option>
              </select>
            </label>
            <label>
              {t("priceRange")}: {priceRange[0]} {t("currency")} -{" "}
              {priceRange[1]} {t("currency")}
              <Slider
                getAriaLabel={() => "Zakres cen"}
                min={0}
                max={1000}
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                getAriaValueText={getAriaValueText}
                disableSwap
              />
            </label>
            <label>
              {t("ratingRange")}: {ratingRange[0]} - {ratingRange[1]}
              <Slider
                getAriaLabel={() => "Zakres ocen"}
                min={0}
                max={5}
                step={0.1}
                value={ratingRange}
                onChange={handleRatingRangeChange}
                valueLabelDisplay="auto"
                getAriaValueText={(value) => `${value} gwiazdek`}
                disableSwap
              />
            </label>
            <label>
              <select value={capacity} onChange={handleCapacityChange}>
                <option value="">{t("selectCapacity")}</option>
                <option value="1">{t("onePerson")}</option>
                <option value="2">{t("twoPeople")}</option>
                <option value="3">{t("threePeople")}</option>
                <option value="4">{t("fourPeople")}</option>
                <option value="5">{t("fivePeople")}</option>
              </select>
            </label>
            <div className="date">
              <div className="pick-date">
                <label>{t("startDate")}:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={today}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("selectStartDate")}
                  locale="pl"
                />
              </div>
              <div className="pick-date">
                <label>{t("endDate")}:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("selectEndDate")}
                  locale="pl"
                />
              </div>
            </div>
          </div>
          <div className="rooms">
            <div className="rooms-list">
              {currentRooms.map((room) => (
                <div
                  key={room.id}
                  className="room-card"
                  onClick={() => goToRoomDetails(room.id)}
                >
                  <img src={room.imagePaths[0]} alt={room.name} />
                  <p>{room.name}</p>
                  <p>
                    {room.pricePerNight} {t("currency")}
                  </p>
                  <div className="rating">
                    <p>{calculateAverageRating(room.reviews)}</p>
                    <img className="star" src="star.png" />
                  </div>
                  <button>{t("reserve")}</button>
                </div>
              ))}
            </div>
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(sortedRooms.length / roomsPerPage) },
                (_, i) => (
                  <div
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomsPage;
