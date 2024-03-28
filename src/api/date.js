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