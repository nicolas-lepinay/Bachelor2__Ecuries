// 🌌 React :
import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

// 📚 Other libraries :
import PropTypes from 'prop-types';

const useFetchHorses = ({
    filters = '',
    isUnique = false,
    } = {}) => {
    

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const HORSES_ROUTE = process.env.REACT_APP_HORSES_ROUTE;

    const query = `${HORSES_ROUTE}?populate=owner.avatar&populate=owner.role&populate=avatar&populate=image&populate=health_record.employee.avatar&populate=appointments.employee.avatar&populate=activities${filters}`;

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); //!important

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}${query}`);
                const resData = res.data.data
                const formattedData = [];
        
                // Reformat object to simplify its structure:
                resData.map( item => {
                    formattedData.push({ 
                        id: item.id, 
                        ...item.attributes
                    });
                });
                isUnique ? setData(formattedData[0]) : setData(formattedData.sort((a, b) => a.name.localeCompare(b.name))); // Tri alphabétique en fonction du nom
            } catch(err) {
                setError(err)
                console.log('USE FETCH HORSES | ' + err)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [query])

    return { 
        data,
        setData,
        loading,
        error,
    }
}
  

export default useFetchHorses;