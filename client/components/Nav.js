import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

// CSS :
import styles from '../styles/Nav.module.scss'

function Nav() {
    const router = useRouter()
    const route = router.route
    const [path, setPath] = useState("")
    const [active, setActive] = useState(false)

    const navigation = [
        { href: '/', name: 'Accueil' },
        { href: '/notre-equipe', name: 'Équipe' },
        { href: '/nos-installations', name: 'Installations' },
        { href: '/nos-prestations', name: 'Prestations' },
        { href: '/contact', name: 'Contact' },
        { href: '/se-connecter', name: 'Mon compte' },
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
                    <li>
                        <Link href='mailto:ecuriesdepersevere@hotmail.fr'>Nous contacter</Link>
                    </li>
                    <li>
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

            <div className={active ? styles.contentActive : styles.content}>
                <ul>
                    {navigation.map( (item) => (
                        <li className={item.name == path && styles.current_path}>                        
                            <Link href={item.href}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Nav