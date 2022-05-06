// 🌌 React :
import { useState, useContext } from 'react'

// 🗝️ Auth Context :
import { AuthContext } from '../contexts/AuthContext';

// 🅰️ Axios :
import axios from 'axios';

function useProvideAuth() {
    // ⚙️ Strapi's URL :
    const API_URL = process.env.REACT_APP_API_URL;

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("persevere_user")) || null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // LOGIN
    const login = async ({ identifier, password }) => {
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/api/auth/local?populate=*`, { identifier, password });
            const data = await res.data;
            if(data.user.confirmed === true) {
                let user = { ...data.user, jwt: data.jwt };
                const fullUser = await axios.get(`${API_URL}/api/users?filters[id]=${user.id}`); // Get all fields (avatar, role, adress, horses, etc.)
                const fullUserData = fullUser.data[0];
                user = { ...user, ...fullUserData};
                setUser(user);
                localStorage.setItem("persevere_user", JSON.stringify(user)); // Send user to local storage
                console.log(`CONNEXION | Connexion réussie. Bienvenue, ${user?.name} ${user?.surname}.`);
                setLoading(false);
            } else {
                console.log("CONNEXION | Ce compte n'a pas encore été confirmé par un administrateur.");
                setLoading(false);
                setError({ 
                    status: 403,
                    action: 'login',
                    message: "Ce compte n'a pas encore été validé par un administrateur.",
                })
            }
        } catch(err) {
            console.log("CONNEXION | Une erreur est survenue lors de la tentative de connexion. | " + err);
            setLoading(false);
            setError({ 
                status: err.response.status,
                action: 'login',
                message: err.response.status === 400 ? "Aucun compte correspondant n'a été trouvé." : `Oops ! Une erreur s'est produite pendant la connexion 😰\n(code d'erreur ${err.response.status}).`,
            })
        }
    }

    // REGISTER
    const register = async (registerData) => {
        setLoading(true)
        try {
            const { role, ...rest} = registerData
            const res = await axios.post(`${API_URL}/api/auth/local/register`, rest)
            const data = await res.data
            // Set user to 'Unconfirmed' and update their role :
            await axios.put(`${API_URL}/api/users/${data.user.id}`, { confirmed: false, role })
            console.log(`INSCRIPTION | Le compte de ${data.user.username} a bien été créé. Un administrateur doit confirmer son inscription.`)
            setLoading(false)
            setSuccess({
                action: 'register', 
                message: 'Votre inscription a été prise en compte.\nVotre compte doit être validé par un administrateur.'
            })
        } catch(err) {
            console.log("INSCRIPTION | Une erreur est survenue lors de la tentative d'inscription. | " + err)
            setLoading(false)
            setError({ 
                status: err.response.status,
                action: 'register',
                message: `Oops ! Une erreur s'est produite pendant l'inscription (code ${err.response.status}).`,
            })
        }
    }

    // LOGOUT
    const logout = () => {
        setUser(null);
        localStorage.removeItem("persevere_user");
    }

    // UPDATE USER
    const updateUser = async (updatedData) => {
        setLoading(true)
        try {
            await axios.put(`${API_URL}/api/users/${user.id}`, updatedData);
            const fullUser = await axios.get(`${API_URL}/api/users?filters[id]=${user.id}`); // Get all fields (avatar, role, adress, horses, etc.)
            const fullUserData = fullUser.data[0];
            // setUser({ ...user, ...fullUserData});
            setUser({ ...fullUserData});
            localStorage.setItem("persevere_user", JSON.stringify({ ...fullUserData}));
            setLoading(false);
            setSuccess({
                action: 'update', 
                message: "L'utilisateur a été mis à jour.",
            })
            console.log("MISE A JOUR | L'utilisateur a été mis à jour.")
        } catch(err) {
            setLoading(false)
            setError({ 
                status: err.response.status,
                action: 'update',
                message: `Une erreur est survenue (code ${err.response.status}).`,
            })
            console.log("MISE A JOUR | Une erreur est survenue lors de la tentative de mise à jour de l'utilisateur. | " + err)
        }
    }

    return { 
        user,
        loading,
        error,
        success,
        login,
        register,
        logout,
        updateUser,
    }
};

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            { children }
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth;
