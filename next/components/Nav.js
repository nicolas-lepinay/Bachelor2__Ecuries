// 🌀 Next :
import Link from 'next/link'
import { useRouter } from 'next/router'
import getConfig from 'next/config'

// 🌌 React :
import { useEffect, useState } from "react";

// 💅 CSS :
import styles from '../styles/Nav.module.scss'

function Nav() {

    // ⚙️ Get React App's URL :
    const { publicRuntimeConfig } = getConfig()

    const router = useRouter()
    const [path, setPath] = useState("")
    const [active, setActive] = useState(false)

    const navigation = [
        { href: '/', name: 'Accueil' },
        { href: '/notre-equipe', name: 'Équipe' },
        { href: '/nos-installations', name: 'Installations' },
        { href: '/nos-prestations', name: 'Prestations' },
        { href: '/contact', name: 'Contact' },
        // { href: publicRuntimeConfig.REACT_APP_URL, name: 'Mon compte' },
    ]

    useEffect( () => {
        navigation.map( (item) => {
            router.route == item.href && setPath(item.name)
        })
    }, [router])

    return (
        <>
            <nav className={styles.nav}>
                <ul>
                    <li className={path == 'Mon compte' ? styles.invisible : undefined}>
                        <Link href='mailto:ecuriesdepersevere@hotmail.fr'>Nous contacter</Link>
                    </li>
                    <li className={path == 'Mon compte' ? styles.invisible : undefined}>
                        <h3>Écuries de Persévère</h3>
                    </li>
                    <li>
                        <p className={styles.current_path}>{path}</p>
                        <div className={styles.menu_toggle} onClick={() => setActive(!active)}>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                    </li>
                </ul>
            </nav>

            <div className={active ? styles.contentActive : styles.content} onClick={() => setActive(false)}>
                <ul>
                    {navigation.map( (item) => (
                        <li className={item.name == path ? styles.current_path : undefined} key={item.href}>                        
                            <Link href={item.href}>{item.name}</Link>
                        </li>
                    ))}
                    <li>                        
                        <a href={publicRuntimeConfig.REACT_APP_URL} target='_blank'>Mon compte</a>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Nav