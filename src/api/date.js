export const handleStartDateChange = (date, setStartDate, setOverlapError) => {
    setStartDate(date);
    setOverlapError(false);
};

export const isBetweenDates = (dateStart, dateEnd, date) =>  date > dateStart && date < dateEnd;

export const handleEndDateChange = (date, setEndDate, setOverlapError, startDate, reservedDates) => {
    setEndDate(date);
    const overlap = reservedDates.some(reservedDate => isBetweenDates(startDate, date, reservedDate));
    setOverlapError(overlap);
  };

export const formatDate = (dateArray) => {
    const [year, month, day] = dateArray;
    return `${day}-${month}-${year}`;
}

export const isRoomAvailable = (room, startDate, endDate) => {
    if (!startDate || !endDate) {
        return true;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if(room.name == "Royal Room"){
        console.log(start + " " + end)
        console.log(room)
    }

    return room.bookings.every(booking => {
        
        const checkIn = new Date(booking.checkInDate[0], booking.checkInDate[1] - 1, booking.checkInDate[2]);
        const checkOut = new Date(booking.checkOutDate[0], booking.checkOutDate[1] - 1, booking.checkOutDate[2]);
        return !(start < checkOut && end > checkIn);
    });
};