import Meta from './Meta'
import Nav from './Nav'

const Layout = ({children}) => {
  return (
    <>
        <Meta />
        <Nav/>
        <div>
            {children}
        </div>
    </>
  )
}

export default Layout