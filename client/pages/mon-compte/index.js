// 🍪 Nookies :
import { parseCookies } from 'nookies'

function index({ user }) {
    return (
        <>
            <h1>Mon compte</h1>
            <h3>Bienvenue, {user?.username}</h3>
        </>
    )
}

export async function getServerSideProps(ctx) {
    try {
        const cookie = parseCookies(ctx).user
        const user = JSON.parse(cookie)

        return {
            props: {
                user,
            },
        }
    } catch(err) {
        return {
            redirect: {
              permanent: false,
              destination: '/se-connecter',
            }
        }
    }
}

export default index