import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchBreeds = ({
    filters = '',
    isUnique = false,
    } = {}) => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const CHATS_ROUTE = process.env.REACT_APP_CHATS_ROUTE;

    const query = `${CHATS_ROUTE}?populate=users.avatar&populate=messages.sender.avatar${filters}`;

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}${query}`);
                const resData = res.data.data;

                const formattedData = [];

                // Reformat object to simply its structure:
                resData.map( item => {
                formattedData.push({ 
                    id: item.id, 
                    ...item.attributes
                    });
                });
                
                isUnique ? setData(formattedData[0]) : setData(formattedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            } catch(err) {
                setError(err)
                console.log('USE FETCH CHATS | ' + err)
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

export default useFetchBreeds;