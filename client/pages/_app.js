// NextJS Components :
import Layout from '../components/Layout'
// CSS :
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp
