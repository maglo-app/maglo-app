import styles from '../styles/layout.module.css'
import Navbar from './navbar.js'


function Layout({children}) {
    return ( 
        <div className={styles.container}>
            <Navbar/>
            {children}
        </div>
     );
}

export default Layout;