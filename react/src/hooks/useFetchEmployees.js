import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchEmployees = () => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const USERS_ROUTE = process.env.REACT_APP_USERS_ROUTE;

    // ⚙️ PRO ID and ADMIN ID :
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'

    const query = `${USERS_ROUTE}?populate=*&filters[role][id]=${PRO_ID}&filters[role][id]=${ADMIN_ID}`;

    const [data, setData] = useState([]);
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
                console.log('USE FETCH EMPLOYEES | ' + query + ' | ' + err)
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

export default useFetchEmployees;