import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchAvatars = ({
    filters = '',
    isUnique = false,
    } = {}) => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const AVATARS_ROUTE = process.env.REACT_APP_AVATARS_ROUTE;

    const query = `${AVATARS_ROUTE}?populate=*${filters}`;

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}${query}`);
                const resData = res.data.data.attributes.avatars.data;
                
                isUnique ? setData(resData[0]) : setData(resData);

            } catch(err) {
                setError(err)
                console.log('USE FETCH AVATARS | ' + err)
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

export default useFetchAvatars