import { useEffect, useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const useFetchAppointments = () => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const query = '/api/appointments?populate=clients.avatar&populate=employees.avatar&populate=employees.role';

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
                    formattedData.push(item.attributes);
                });
                
                // Convert date fields (start, end) to Date objects :
                formattedData.map( item => {
                    if(item.start) 
                    item.start = new Date(item.start);
                    if(item.end)
                    item.end = new Date(item.end);
                })
                setData(formattedData);
            } catch(err) {
                setError(err)
                console.log('USE FETCH APPOINTMENTS | ' + query + ' | ' + err)
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

export default useFetchAppointments;