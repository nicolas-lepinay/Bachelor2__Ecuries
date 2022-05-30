import Meta from './Meta'
import Nav from './Nav'
import Footer from './Footer'

const Layout = ({children}) => {
  return (
    <>
        <Meta/>
        <Nav/>
        <div>
            {children}
        </div>
        <Footer/>
    </>
  )
}

export default Layout