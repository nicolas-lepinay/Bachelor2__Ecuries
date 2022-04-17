import Image from 'next/image'

// CSS :
import styles from '../styles/Home.module.scss'

export default function Home() {

  return (
    <>
        <section className={styles.section_landing}>
            <Image src='/accueil/home_banner.jpg' layout="fill" objectFit="cover" className={styles.image_landing}/>
            <div className={styles.middle}>
                <div className={styles.title}>
                    <div className={styles.wrapper}>
                        <span/>
                        <h5>Les écuries de</h5>
                        <span/>
                    </div>
                    <h1>Persévère</h1>
                </div>
                <button className={styles.button}>En savoir plus</button>
            </div>
        </section>

        <section className={styles.section_about}>
            <img src='/accueil/home_about_cropped.jpg' className={styles.about__background_image}/>
            <div className={styles.about__container}>
                <div className={styles.about__wrapper}>
                    <div className={styles.about__description_container}></div>
                    <img src='/accueil/home_about_vignette.jpg' className={styles.about__vignette}/>
                    <div className={styles.about__description_title}>
                        <h1>Plus que des écuries</h1>
                        <h2>Un havre de paix</h2>
                        <p>
                        “Karine et toute son équipe sont des gens passionnés, responsables et professionnels. 
                        Elle se renouvelle et évolue constamment par de nombreuses formations. Elle cherche également sans cesse à améliorer le cadre de vie de chacun.
                        Ce lieu est ainsi, un véritable havre de paix, ou chose rare, se combinent respect et bien être du cheval et du cavalier, et performance.
                        Chaque couple est libre de suivre sa voie, accompagné au mieux techniquement et humainement.”
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h5>SUITE</h5>
        </section>
    </>
  )
}
