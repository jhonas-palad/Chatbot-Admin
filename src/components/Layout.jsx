import { Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import '../css/main.css';
import '../css/sizing.css';

// import NavigationBar from "./NavigationBar";


const Layout = () => {
    return (
        <>
            {/* <NavigationBar/> */}
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout