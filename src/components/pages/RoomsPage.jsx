import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/rooms-page.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../../api/rooms';
import ReactSlider from 'react-slider';
import { Slider } from '@mui/material';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [capacity, setCapacity] = useState('');

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


    const filteredRooms = rooms.filter(room => {
        const matchesSearchTerm = room.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMinPrice = room.pricePerNight >= priceRange[0];
        const matchesMaxPrice = room.pricePerNight <= priceRange[1];
        const matchesCapacity = capacity === '' || room.capacity == parseInt(capacity);

        return matchesSearchTerm && matchesMinPrice && matchesMaxPrice && matchesCapacity;
    });
    const getAriaValueText = (value) => {
        return `${value} zł`;
    };

    const roomsPerPage = 6;
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Navbar />
            <div className='rooms-page'>
                <h1>Pokoje i apartamenty</h1>
                <div className='main-content'>
                    <div className="filter-panel">
                        <input className="search-input" type="text" placeholder="Wyszukaj pokój..." value={searchTerm} onChange={handleSearchChange} />
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
                    </div>
                    <div className='rooms'>
                        <div className='rooms-list'>
                            {currentRooms.map(room => (
                                <div key={room.id} className='room-card' onClick={() => goToRoomDetails(room.id)}>
                                    <img src={room.imagePaths[0]} alt={room.name} />
                                    <p>{room.name}</p>
                                    <p>{room.pricePerNight} zł</p>
                                    <button>Rezerwuj pokój</button>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            {Array.from({ length: Math.ceil(filteredRooms.length / roomsPerPage) }, (_, i) => (
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
