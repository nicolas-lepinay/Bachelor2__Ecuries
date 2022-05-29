import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchBreeds = ({
    filters = '',
    isUnique = false,
    } = {}) => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const BREEDS_ROUTE = process.env.REACT_APP_BREEDS_ROUTE;

    const query = `${BREEDS_ROUTE}?populate=*${filters}`;

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
                
                isUnique ? setData(formattedData[0]) : setData(formattedData.sort((a, b) => a.name.localeCompare(b.name))); // Tri par ordre alphabétique en fonction du nom
            } catch(err) {
                setError(err)
                console.log('USE FETCH BREEDS | ' + err)
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