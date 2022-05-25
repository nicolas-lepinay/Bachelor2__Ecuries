// 🌌 React :
import { useEffect } from "react";

// 🛠️ useAuth hook :
import useAuth from '../../hooks/useAuth';

import PageWrapper from '../../layout/PageWrapper/PageWrapper';

function Logout() {

    const auth = useAuth();

    // useEffect( () => {
    //     setUser(null);
    //     localStorage.removeItem("persevere_user");
    //     console.log('DECONNEXION | Déconnexion réussie.')
    //     // navigate('/se-connecter')
    // }, []);

    useEffect( () => {
        auth.logout();
    }, []);

    return (
        <PageWrapper>
            <div></div>
        </PageWrapper>
    );
}

export default Logout