import axios from "axios";


export const fetchBookings = async () => {
    try {
        const response = await axios.get('http://localhost:8080/bookings', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        return response.data
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
};


export const fetchBooking = async (id) => {
    try {
        const response = await axios.get('http://localhost:8080/bookings/' + id, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        return response.data
    } catch (error) {
        console.error('Error fetching booking:', error);
    }
};


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
        const response = await axios.post('http://localhost:8080/bookings', values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
            const bookingId = response.data;
            return bookingId;
        } catch (error) {
        console.error('Error posting booking:', error);
    }
};

export const deleteBooking = async (id) => {
    try {
        const response = await axios.delete('http://localhost:8080/bookings/' + id, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        } catch (error) {
        console.error('Error deleting booking:', error);
    }
};
