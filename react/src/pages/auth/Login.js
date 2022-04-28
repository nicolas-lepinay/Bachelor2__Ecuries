// 🌌 React :
import { useState, useContext } from "react";

// 🦸 User Context :
import { UserContext } from '../../contexts/UserContext';

// 💖 FontAwesome :
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

// 💅 CSS :
// import styles from '../../styles/Login.module.scss'

// 🅰️ Axios :
import axios from 'axios';

function Login() {

    // ⚙️ API URL :
    const API_URL = process.env.REACT_APP_API_URL;
    
    // 🦸 User:
    const { user, setUser } = useContext(UserContext);
    
    // ➡️ Active state for panel slide:
    const [active, setActive] = useState(false);

    // ✉️ Login info:
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // ⛔ Login erros:
    const [noAccount, setNoAccount] = useState(false)
    const [unconfirmedAccount, setUnconfirmedAccount] = useState(false)

    // 🗝️ Login function:
    const handleLogin = async (e) => {
        e.preventDefault();   
        
        // Clear error messages:
        setNoAccount(false)
        setUnconfirmedAccount(false)

        const loginInfo = {
            identifier: loginEmail,
            password: loginPassword
        }
        try {
            const res = await axios.post(`${API_URL}/auth/local?populate=*`, loginInfo)
            const authData = await res.data
            if(authData.user.confirmed === true) {
                const currentUser = { ...authData.user, jwt: authData.jwt}
                setUser(currentUser) // Set user context
                localStorage.setItem("persevere_user", JSON.stringify(currentUser)) // Send user to local storage
                console.log(`LOGIN | Connexion réussie. Bienvenue, ${currentUser.username}.`)
            } else {
                console.log("LOGIN | Ce compte n'a pas encore été confirmé par un administrateur.")
                setUnconfirmedAccount(true)
            }
        } catch(err) {
            setNoAccount(true)
            console.log("LOGIN | Une erreur est survenue lors de la tentative de connexion. | " + err)
        }
    }

    return (
        <main className='LOGIN'>
            <div className='modal_wrapper'>
                <div className={active ? 'modal_container__right_panel_active' : 'modal_container'}>
                    <div className='form_wrapper__signup'>
                        {/* <!-- | FORM SIGN-UP | --> */}
                        <form className='form'>
                            <h1 className='title'>S'inscrire</h1>
            
                            {/* <!-- USERNAME INPUT --> */}
                            <div className='input_with_icon'>
                                <FontAwesomeIcon icon={faUser} className='material_icon' />
                                <input className='input'
                                    type="text"
                                    placeholder="Nom complet"
                                    pattern="^[ a-zA-Z0-9.]{3,40}" title="Seuls les lettres, espaces et points sont acceptés. Entre 3 et 40 caractères."
                                    required
                                />
                            </div>
            
                            {/* <!-- EMAIL INPUT --> */}
                            <div className='input_with_icon'>
                                <FontAwesomeIcon icon={faEnvelope} className='material_icon' />
                                <input className='input'
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    maxLength="40"
                                    required
                                />
                            </div>
            
                            {/* <!-- PASSWORD (1) INPUT --> */}
                            <div className='input_with_icon'>
                                <FontAwesomeIcon icon={faLock} className='material_icon' />
                                <input className='input'
                                    type="password"
                                    placeholder="Mot de passe"
                                    required
                                    // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}"
                                    // title="At least 6 characters, including a number, an uppercase letter and a lowercase letter."
                                />
                            </div>
            
                            {/* <!-- PASSWORD (2) INPUT --> */}
                            <div className='input_with_icon'>
                                <FontAwesomeIcon icon={faLock} className='material_icon'/>
                                <input className='input'
                                    type="password"
                                    placeholder="Confirmer votre mot de passe"
                                    required
                                />
                            </div>
                            <button className='button' type="submit">Continuer</button>
                        </form>
                    </div>
                    <div className='form_wrapper__signin'>
                        {/* <!-- | FORM SIGN-IN | --> */}
                        <form className='form' onSubmit={handleLogin}>
                            <h1 className='title'>Se connecter</h1>
            
                            <div className='input_with_icon'>
                                <FontAwesomeIcon icon={faEnvelope} className='material_icon' />
                                <input
                                    className='input'
                                    onChange={ (e) => setLoginEmail(e.target.value)}
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    required/>
                            </div>
            
                            <div className='input_with_icon'>
                                <FontAwesomeIcon icon={faLock} className='material_icon' />
                                <input
                                    className='input'
                                    onChange={ (e) => setLoginPassword(e.target.value)}
                                    type="password"
                                    placeholder="Mot de passe"
                                    required/>
                            </div>
                            {noAccount && <p className='error_message'>Aucun compte correspondant n'a été trouvé.</p>}
                            {unconfirmedAccount && <p className='error_message'>Ce compte n'a pas encore été validé par un administrateur.</p>}
            
                            <button className='button' type="submit">Continuer</button>
                        </form>
                    </div>
                    <div className='overlay_container'>
                        <div className='overlay'>
                            <div className='panel__left'>
                                <h1 className='title'>Déjà membre ?</h1>
                                <p className='description'>Si vous possédez déjà un compte sur les Écuries de Persévère, utilisez vos identifiants pour vous connecter.</p>
                                <button className='button__ghost' onClick={() => setActive(!active)}>Se connecter</button>
                            </div>
                            <div className='panel__right'>
                                <h1 className='title'>Pas encore membre ?</h1>
                                <p className='description'>Inscrivez-vous et attendez qu'un administrateur valide votre compte.</p>
                                <button className='button__ghost' onClick={() => setActive(!active)}>S'inscrire</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login