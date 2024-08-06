import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/rooms-page.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../../api/rooms';
import DatePicker from 'react-datepicker';
import { Slider } from '@mui/material';
import { isRoomAvailable } from '../../api/date';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [capacity, setCapacity] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortOrder, setSortOrder] = useState(''); 
    const today = new Date();

    useEffect(() => {
        const fetchData = async () => {
            const roomsData = await fetchRooms();
            setRooms(roomsData);
        };
        fetchData();
    }, []);

    const navigateTo = useNavigate();
    const goToRoomDetails = (roomId) => {
        navigateTo('/rooms/' + roomId);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleCapacityChange = (event) => {
        setCapacity(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearchTerm = room.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMinPrice = room.pricePerNight >= priceRange[0];
        const matchesMaxPrice = room.pricePerNight <= priceRange[1];
        const matchesCapacity = capacity === '' || room.capacity == parseInt(capacity);
        const matchesAvailability = isRoomAvailable(room, startDate, endDate);

        return matchesSearchTerm && matchesMinPrice && matchesMaxPrice && matchesCapacity && matchesAvailability;
    });

    const sortedRooms = filteredRooms.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        } else if (sortOrder === 'desc') {
            return b.name.localeCompare(a.name);
        } else {
            return 0;
        }
    });

    const getAriaValueText = (value) => {
        return `${value} zł`;
    };

    const roomsPerPage = 6;
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Formatuj wynik do jednej liczby po przecinku
    };

    return (
        <>
            <Navbar />
            <div className='rooms-page'>
                <h1>Pokoje i apartamenty</h1>
                <div className='main-content'>
                    <div className="filter-panel">
                        <input className="search-input" type="text" placeholder="Wyszukaj pokój..." value={searchTerm} onChange={handleSearchChange} />
                        <label>
                            Sortuj według:
                            <select value={sortOrder} onChange={handleSortChange}>
                                <option value=''>Wybierz opcję</option>
                                <option value='asc'>od A do Z</option>
                                <option value='desc'>od Z do A</option>
                            </select>
                        </label>
                        <label>
                            Zakres cen: {priceRange[0]} zł - {priceRange[1]} zł
                            <Slider
                                getAriaLabel={() => 'Zakres cen'}
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
                            <select value={capacity} onChange={handleCapacityChange}>
                                <option value=''>Wybierz liczbę osób</option>
                                <option value='1'>1 osoba</option>
                                <option value='2'>2 osoby</option>
                                <option value='3'>3 osoby</option>
                                <option value='4'>4 osoby</option>
                                <option value='5'>5 osób</option>
                            </select>
                        </label>
                        <div className='date'>
                            <div className='pick-date'>
                                <label>Początek rezerwacji:</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={today}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Wybierz datę początku"
                                    locale="pl"
                                />
                            </div>
                            <div className='pick-date'>
                                <label>Koniec rezerwacji:</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Wybierz datę końca"
                                    locale="pl"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='rooms'>
                        <div className='rooms-list'>
                            {currentRooms.map(room => (
                                <div key={room.id} className='room-card' onClick={() => goToRoomDetails(room.id)}>
                                    <img src={room.imagePaths[0]} alt={room.name} />
                                    <p>{room.name}</p>
                                    <p>{room.pricePerNight} zł</p>
                                    <div className='rating'>
                                        <p>{calculateAverageRating(room.reviews)}</p>
                                        <img className="star" src='star.png'/>
                                    </div>
                                    <button>Rezerwuj pokój</button>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            {Array.from({ length: Math.ceil(sortedRooms.length / roomsPerPage) }, (_, i) => (
                                <div key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => paginate(i + 1)}>{i + 1}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RoomsPage;
