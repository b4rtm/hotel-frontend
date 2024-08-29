import axios from "axios";


export const postEmployee = async (values) => {
    try {
        const response = await axios.post('http://localhost:8080/employees', values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
    } catch (error) {
        console.error('Error posting employees:', error);
    }
};

export const fetchEmployees = async () => {
    try {
        const response = await axios.get('http://localhost:8080/employees', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
            console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete('http://localhost:8080/employees/' + id, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

export const putEmployee = async (id, values) => {
    try {
        const response = await axios.put('http://localhost:8080/employees/' + id, values, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
    } catch (error) {
        console.error('Error putting employee:', error);
    }
};

export const translateRole = (role) => {
    switch (role) {
        case 'COOK':
            return 'Kucharz/Kucharka';
        case 'SECURITY':
            return 'Ochroniarz/Ochroniarka';
        case 'RECEPTIONIST':
            return 'Recepcjonista/Recepcjoniska';
        case 'HOUSEKEEPER':
            return 'Pokojówka/Pokojowy';
        default:
            return role; // Na wypadek, gdyby pojawiła się nowa rola
    }
};