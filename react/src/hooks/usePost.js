import { useState } from 'react';

// 🅰️ Axios :
import axios from 'axios';

const usePost = () => {

    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const APPOINTMENTS_ROUTE = process.env.REACT_APP_APPOINTMENTS_ROUTE;

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const appointments = async (dataToSend) => {
        setLoading(true)
        try {
            await axios.post(`${API_URL}${APPOINTMENTS_ROUTE}?populate=employees.avatar&populate=employees.role&populate=horses.owner`, { data: dataToSend });
            const updatedAppointments = await axios.get(`${API_URL}${APPOINTMENTS_ROUTE}?populate=employees.avatar&populate=employees.role&populate=horses.owner`);

            // let formattedData = { id: resData.id, ...resData.attributes }

            // if(formattedData?.start)
            //     formattedData.start = new Date(formattedData.start)
            // if(formattedData?.end)
            //     formattedData.end = new Date(formattedData.end)

            // setData(formattedData);

            const resData = updatedAppointments.data.data
            const formattedData = [];
    
            // Reformat object to simply its structure:
            resData.map( item => {
                formattedData.push({ 
                    id: item.id, 
                    ...item.attributes
                });
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
            console.log("USE POST | Appointment | Le rendez-vous n'a pas pu être ajouté à la base de données. | " + err);
            setError({ 
                status: err.response.status,
                action: 'appointment',
                message: `Oops ! Une erreur s'est produite pendant l'ajout à la base de données 😰\n(code d'erreur ${err.response.status}).`,
            })
        } finally {
            setLoading(false);
        }
    }

    return { 
        data,
        setData,
        loading,
        error,
        appointments,
    }
}

export default usePost;