// 🌌 React :
// import { useState, useMemo, useEffect } from "react";

// 🍦 NextJS Components :
import Layout from '../components/Layout'

// 🦸 User Context :
// import { UserContext } from "../context/UserContext"

// 💅 CSS :
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {

    // const [user, setUser] = useState(null);
    // const currentUser = useMemo( () => ({user, setUser}), [user, setUser] );

    // useEffect( () => {
    //     setUser(JSON.parse(localStorage.getItem("persevere_user")) || null)
    // }, [])

    return (
        // <UserContext.Provider value={currentUser}>
        <Layout>
            <Component {...pageProps} />
        </Layout>
        // </UserContext.Provider>
    )
} 

export default MyApp
