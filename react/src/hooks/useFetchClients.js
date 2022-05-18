import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchClients = ({
    filters = '',
    isUnique = false,
    } = {}) => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const USERS_ROUTE = process.env.REACT_APP_USERS_ROUTE;

    // ⚙️ CLIENT ID :
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    const query = `${USERS_ROUTE}?populate=*&filters[role][id]=${CLIENT_ID}${filters}`;

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}${query}`);
                isUnique ? setData(res.data[0]) : setData(res.data);
            } catch(err) {
                setError(err)
                console.log('USE FETCH CLIENTS | ' + query + ' | ' + err)
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

export default useFetchClients;