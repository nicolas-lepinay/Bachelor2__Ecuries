// 🌌 React :
import { useState } from "react";

// 🛠️ Hooks :
import useAuth from '../../hooks/useAuth';
import useDarkMode from '../../hooks/useDarkMode';

import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Spinner from '../../components/bootstrap/Spinner'

// 💖 FontAwesome :
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";


function Login() {

    // ⚙️ PRO ID AND CLIENT ID :
    const PRO_ID = process.env.REACT_APP_PRO_ID;
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

    // 🦸 Auth :
    const auth = useAuth();

	const { darkModeStatus, setDarkModeStatus } = useDarkMode();

    // ➡️ Active state for panel slide:
    const [active, setActive] = useState(false);

    // ✉️ Login info:
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // ✉️ Sign-up info:
    const [signupName, setSignupName] = useState('');
    const [signupSurname, setSignupSurname] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupPassword2, setSignupPassword2] = useState('');
    const [isPro, setIsPro] = useState(false);

    // 🗝️ Login function:
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginInfo = {
            identifier: loginEmail,
            password: loginPassword
        }
        auth.login(loginInfo)
    }

    // 🗝️ Register function:
    const handleSignup = async (e) => {
        e.preventDefault();   
        const signupInfo = {
            username: `${signupName} ${signupSurname}`,
            name: signupName,
            surname: signupSurname,
            email: signupEmail,
            phone: signupPhone,
            password: signupPassword,
            role: { id: isPro ? PRO_ID : CLIENT_ID }
        }
        auth.register(signupInfo)
    }

    // useEffect( () => {

    // }, [])

    return (
        <PageWrapper title='Connexion' className='no-class' isLoginPage={true}>
            <main className='LOGIN'>
                <div className='modal_wrapper'>
                    <div className={active ? 'modal_container__right_panel_active' : 'modal_container'}>
                        <div className='form_wrapper__signup'>
                            {/* <!-- | FORM SIGN-UP | --> */}
                            <form className='form' onSubmit={handleSignup}>
                                <h1 className='title'>S'inscrire</h1>
            
                                {/* <!-- NAME INPUT --> */}
                                    <div className='input_with_icon'>
                                        <FontAwesomeIcon icon={faUser} className='material_icon' />
                                        <input className='input'
                                            type="text"
                                            placeholder="Prénom"
                                            onChange={ (e) => setSignupName(e.target.value)}
                                            pattern="^[ a-zA-Z0-9.]{2,20}" title="Seuls les lettres, espaces et points sont acceptés. Entre 2 et 20 caractères."
                                            required
                                        />
                                    </div>
                                {/* <!-- SURNAME INPUT --> */}
                                    <div className='input_with_icon'>
                                        <FontAwesomeIcon icon={faUser} className='material_icon' />
                                        <input className='input'
                                                type="text"
                                                placeholder="Nom de famille"
                                                onChange={ (e) => setSignupSurname(e.target.value)}
                                                pattern="^[ a-zA-Z0-9.]{2,30}" title="Seuls les lettres, espaces et points sont acceptés. Entre 2 et 30 caractères."
                                                required
                                            />
                                    </div>
                                {/* <!-- EMAIL INPUT --> */}
                                <div className='input_with_icon'>
                                    <FontAwesomeIcon icon={faEnvelope} className='material_icon' />
                                    <input className='input'
                                        type="email"
                                        placeholder="Adresse e-mail"
                                        onChange={ (e) => setSignupEmail(e.target.value)}
                                        maxLength="40"
                                        required
                                    />
                                </div>
                                {/* <!-- PHONE INPUT --> */}
                                <div className='input_with_icon'>
                                    <FontAwesomeIcon icon={faPhone} className='material_icon' />
                                    <input className='input'
                                        type="text"
                                        placeholder="Numéro de téléphone"
                                        onChange={ (e) => setSignupPhone(e.target.value)}
                                        maxLength="12"
                                        required
                                    />
                                </div>
            
                                {/* <!-- PASSWORD (1) INPUT --> */}
                                <div className='input_with_icon'>
                                    <FontAwesomeIcon icon={faLock} className='material_icon' />
                                    <input className='input'
                                        type="password"
                                        placeholder="Mot de passe"
                                        onChange={ (e) => setSignupPassword(e.target.value)}
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
                                        onChange={ (e) => setSignupPassword2(e.target.value)}
                                        required
                                    />
                                </div>
                                {/* <!-- IS A PROFESSIONAL ? --> */}
                                <label className='checkbox_label'>
                                    <input
                                        type="checkbox"
                                        className='checkbox_input'
                                        value={isPro}
                                        onChange={ () => setIsPro(!isPro)}
                                    />
                                    Je m'inscris en tant que professionnel.
                                </label>

                                {auth.success && auth.success.action === 'register' && <p className='confirmation_message new-line'>{auth.success.message}</p>}
                                {auth.error && auth.error.action === 'register' && <p className='error_message'>{auth.error.message}</p>}
                                
                                <button
                                    className='button'
                                    type="submit"
                                    disabled={auth.loading || signupName === '' || signupSurname === '' || signupEmail === '' || signupPhone === '' || signupPassword === '' || signupPassword2 === '' || signupPassword != signupPassword2}
                                    >
                                    {auth.loading && <Spinner inButton isSmall />}
                                    {!auth.loading && 'Continuer'}
                                </button>
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

                                {auth.error && auth.error.action ==='login' && <p className='error_message new-line'>{auth.error.message}</p>}
            
                                <button 
                                    className='button' 
                                    type="submit"
                                    disabled={auth.loading || loginEmail === '' || loginPassword === ''}
                                    >
                                    {auth.loading && <Spinner inButton isSmall />}
                                    {!auth.loading && 'Continuer'}
                                </button>
                            </form>
                        </div>

                        <div className='overlay_container'>
                            <div className='overlay'>
                                <div className='panel__left'>
                                    <h1 className='title'>Déjà membre ?</h1>
                                    <p className='description'>Si vous possédez déjà un compte sur les Écuries de Persévère, utilisez vos identifiants pour vous connecter.</p>
                                    <button className='button ghost' onClick={() => setActive(!active)}>Se connecter</button>
                                </div>
                                <div className='panel__right'>
                                    <h1 className='title'>Pas encore membre ?</h1>
                                    <p className='description'>Inscrivez-vous et attendez qu'un administrateur valide votre compte.</p>
                                    <button className='button ghost' onClick={() => setActive(!active)}>S'inscrire</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PageWrapper>
    )
}

export default Login