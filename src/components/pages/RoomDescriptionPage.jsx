import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import Navbar from '../Navbar';
import '../../stylesheets/room-desc.css';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import pl from 'date-fns/locale/pl';
import { fetchRoom } from '../../api/rooms';
import { generateDatesBetween, postBooking } from '../../api/bookings';
import { handleEndDateChange, handleStartDateChange } from '../../api/date';
import { fetchUser } from '../../api/users';
import RoomSlider from '../RoomSlider';
import { Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';

registerLocale('pl', pl);

const RoomDescriptionPage = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reservedDates, setReservedDates] = useState(null);
    const [overlapError, setOverlapError] = useState(false);
    const { id } = useParams();
    const [room, setRoom] = useState();
    const [user, setUser] = useState();
    const [isReservationAttempted, setIsReservationAttempted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const roomData = await fetchRoom(id);
            setRoom(roomData);
            const userData = await fetchUser();
            setUser(userData);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (room && room.bookings) {
            const parsedDates = room.bookings.flatMap(booking =>
                generateDatesBetween(
                    new Date(booking.checkInDate.join('-')),
                    new Date(booking.checkOutDate.join('-'))
                )
            );
            setReservedDates(parsedDates);
        }
        if (room && room.reviews) {
            calculateAverageRating(room.reviews);
        }
    }, [room]);

    const calculateAverageRating = (reviews) => {
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        const average = total / reviews.length;
        setAverageRating(average);
    };

    const handleReservation = async () => {
        setIsReservationAttempted(true);
        if (!user) {
            localStorage.setItem('redirectPath', `/rooms/${id}`);
            navigateTo('/login');
        } else if (!overlapError && startDate && endDate) {
            openModal();
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <div className='room-desc'>
                <div className='first-row'>
                    <RoomSlider room={room} />
                    <h1>{room?.name}</h1>
                </div>
                <div className='second-row'>
                    <p className='desc'>{room?.description}</p>
                    <p className='price'>{room?.pricePerNight} {t('currency')} {t('perNight')}</p>
                    <p className='capacity'>{t('roomCapacity')} {room?.capacity} {room?.capacity === 1 ? t('person') : t('people')}</p>
                    
                    <div className='date'>
                        <div className='pick-date'>
                            <label>{t('startDate')}:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => handleStartDateChange(date, setStartDate, setOverlapError)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText={t('selectStartDate')}
                                excludeDates={reservedDates}
                                filterDate={(date) => {
                                    return date >= new Date() && !reservedDates.includes(date);
                                }}
                                locale="pl"
                            />
                        </div>
                        <div className='pick-date'>
                            <label>{t('endDate')}:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => handleEndDateChange(date, setEndDate, setOverlapError, startDate, reservedDates)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText={t('selectEndDate')}
                                excludeDates={reservedDates}
                                filterDate={(date) => {
                                    return date >= new Date() && !reservedDates.includes(date);
                                }}
                                locale="pl"
                            />
                        </div>
                    </div>
                    {overlapError && <p style={{ color: 'red' }}>{t('dateOverlapError')}</p>}
                    {isReservationAttempted && !startDate && !endDate && <p className='error'>{t('selectBothDates')}</p>}
                    <button onClick={handleReservation}>{t('reserve')}</button>
                </div>
            </div>
            <div className='reviews-list'>
                <h1>{t('roomReviews')}:</h1>
                {room?.reviews.length > 0 ? (
                    <>
                        <h2>{t('averageRating')}: {averageRating.toFixed(1)} / 5</h2>
                        {room.reviews.map(review => (
                            <div key={review.id} className='review'>
                                <p>{review.name}</p>
                                <Rating name="read-only" value={review.rating} readOnly />
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>{t('noReviews')}</p>
                )}
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{t('confirmReservation')}</h2>
                        <button onClick={closeModal} style={{ backgroundColor: 'darkred', border: 'red' }}>{t('cancel')}</button>
                        <button onClick={async () => {
                            closeModal();
                            const startDateWithAddedDay = new Date(startDate);
                            startDateWithAddedDay.setDate(startDateWithAddedDay.getDate() + 1);
                            const formattedStartDate = startDateWithAddedDay.toISOString().split('T')[0];

                            const endDateWithAddedDay = new Date(endDate);
                            endDateWithAddedDay.setDate(endDateWithAddedDay.getDate() + 1);
                            const formattedEndDate = endDateWithAddedDay.toISOString().split('T')[0];

                            const id = await postBooking({
                                checkInDate:  formattedStartDate,
                                checkOutDate: formattedEndDate,
                                roomId: room.id,
                                customerId: user?.id
                            });
                            navigateTo("/summary/" + id);
                        }}>{t('confirm')}</button>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default RoomDescriptionPage;
