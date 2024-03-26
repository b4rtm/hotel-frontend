export const handleStartDateChange = date => {
    setStartDate(date);
    setOverlapError(false);
};

export  const isBetweenDates = (dateStart, dateEnd, date) =>  date > dateStart && date < dateEnd;

export  const handleEndDateChange = (date) => {
    setEndDate(date);
    const overlap = reservedDates.some(reservedDate => isBetweenDates(startDate, date, reservedDate));
    setOverlapError(overlap);
};