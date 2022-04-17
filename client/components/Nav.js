import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

// CSS :
import styles from '../styles/Nav.module.scss'

function Nav() {
    const router = useRouter()
    const route = router.route
    const [path, setPath] = useState("")
    console.log(route)

    const navigation = [
        { href: '/', name: 'Accueil' },
        { href: '/a-propos', name: 'A propos' },
        { href: '/contact', name: 'Contact' },
    ]

    useEffect( () => {
        navigation.map( (item) => {
            router.route == item.href && setPath(item.name)
        })
    }, [router])

    return (
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
                    <div className={styles.menu_toggle}>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default Nav