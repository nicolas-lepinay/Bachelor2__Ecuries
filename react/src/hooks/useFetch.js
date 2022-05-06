import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetch = (query) => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}${query}`);
                setData(res.data);
            } catch(err) {
                setError(err)
                console.log('USE FETCH | ' + query + ' | ' + err)
            } finally {
                setLoading(false);
            }
        }
        query && fetchData();
    }, [query])

    return { 
        data,
        setData,
        loading,
        error,
    }
}

export default useFetch;