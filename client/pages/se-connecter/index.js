// 🌌 React :
import { useState } from "react";

// FontAwesome :
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

// 💅 CSS :
import styles from '../../styles/Login.module.scss'

function index() {

    // Active for panel slide :
    const [active, setActive] = useState(false);

    // Sliding panel animation :
    const slidePanel = () => {
        setActive(!active);
    }

    return (
        <div className={styles.modal_wrapper}>
            <div className={active ? styles.modal_container__right_panel_active : styles.modal_container}>
                <div className={styles.form_wrapper__signup}>
                    {/* <!-- | FORM SIGN-UP | --> */}
                    <form className={styles.form}>
                        <h1 className={styles.title}>Inscription</h1>
        
                        {/* <!-- USERNAME INPUT --> */}
                        <div className={styles.input_with_icon}>
                            <FontAwesomeIcon icon={faUser} className={styles.material_icon} />
                            <input className={styles.input}
                                type="text" 
                                placeholder="Choose a username" 
                                pattern="^[ a-zA-Z0-9._]{3,20}" title="Only letters, numbers, spaces, dots and underscores. Length required: 3 ~ 20" 
                                required 
                            />
                        </div>
        
                        {/* <!-- EMAIL INPUT --> */}
                        <div className={styles.input_with_icon}>
                            <FontAwesomeIcon icon={faEnvelope} className={styles.material_icon} />
                            <input className={styles.input}
                                type="email" 
                                placeholder="Enter your email address" 
                                maxlength="40" 
                                required 
                            />
                        </div>
        
                        {/* <!-- PASSWORD (1) INPUT --> */}
                        <div className={styles.input_with_icon}>
                            <FontAwesomeIcon icon={faLock} className={styles.material_icon} />
                            <input className={styles.input}
                                type="password"
                                placeholder="Choose a password" 
                                required 
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}" 
                                title="At least 6 characters, including a number, an uppercase letter and a lowercase letter." 
                            />
                        </div>
        
                        {/* <!-- PASSWORD (2) INPUT --> */}
                        <div className={styles.input_with_icon}>
                            <FontAwesomeIcon icon={faLock} className={styles.material_icon} />
                            <input className={styles.input}
                                type="password" 
                                placeholder="Confirm your password" 
                                required 
                            />
                        </div>
        
                        <button className={styles.button}
                            type="submit"
                            whileTap={{ scale: 0.92 }}
                        >Continuer
                        </button>
                    </form>
                </div>

                <div className={styles.form_wrapper__signin}>
                    {/* <!-- | FORM SIGN-IN | --> */}
                    <form className={styles.form}>
                        <h1 className={styles.title}>Connexion</h1>
        
                        <div className={styles.input_with_icon}>
                            <FontAwesomeIcon icon={faUser} className={styles.material_icon} />
                            <input className={styles.input} type="text" placeholder="Username or email address" required/>
                        </div>
        
                        <div className={styles.input_with_icon}>
                            <FontAwesomeIcon icon={faLock} className={styles.material_icon} />
                            <input className={styles.input} type="password" placeholder="Enter your password" required/>
                        </div>
        
                        <button className={styles.button} type="submit" whileTap={{ scale: 0.92 }}>Continuer</button>
                    </form>
                </div>

                <div className={styles.overlay_container}>
                    <div className={styles.overlay}>
                        <div className={styles.panel__left}>
                            <h1 className={styles.title}>Déjà membre ?</h1>
                            <p className={styles.description}>Si vous possédez déjà un compte sur les Écuries de Persévère, utilisez vos identifiants pour vous connecter.</p>
                            <button className={styles.button__ghost} onClick={() => setActive(!active)}>Se connecter</button>
                        </div>
                        <div className={styles.panel__right}>
                            <h1 className={styles.title}>Pas encore membre ?</h1>
                            <p className={styles.description}>Inscrivez-vous et attendez qu'un administrateur valide votre compte.</p>
                            <button className={styles.button__ghost} onClick={() => setActive(!active)}>S'inscrire</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default index