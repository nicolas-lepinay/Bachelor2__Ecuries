// 🌌 React :
import { useState, useContext, useEffect } from "react";
import {useNavigate} from 'react-router-dom';

// 🦸 User Context :
import { UserContext } from '../../contexts/UserContext';

// 🛠️ useAuth hook :
import useAuth from '../../hooks/useAuth';

import PageWrapper from '../../layout/PageWrapper/PageWrapper';

function Logout() {
    // 🦸 User:
    const { user, setUser } = useContext(UserContext);
    const auth = useAuth();
    const navigate = useNavigate();

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