import axios from "axios";

export const generateDatesBetween = (checkInDate, checkOutDate) => {
    const dates = [];
    const currentDay = new Date(checkInDate);
    while (currentDay <= checkOutDate) {
      dates.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return dates;
  };

  export const postBooking = async (values) => {
    try {
        const response = await axios.post('http://localhost:8080/bookings', values);
    } catch (error) {
        console.error('Error posting booking:', error);
    }
};