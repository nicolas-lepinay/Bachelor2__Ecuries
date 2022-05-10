import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchHorses = () => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const HORSES_ROUTE = process.env.REACT_APP_HORSES_ROUTE;

    const query = `${HORSES_ROUTE}?populate=*`;

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}${query}`);
                const resData = res.data.data
                const formattedData = [];
        
                // Reformat object to simply its structure:
                resData.map( item => {
                    formattedData.push({ 
                        id: item.id, 
                        ...item.attributes
                    });
                });
                setData(formattedData);
            } catch(err) {
                setError(err)
                console.log('USE FETCH HORSES | ' + query + ' | ' + err)
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