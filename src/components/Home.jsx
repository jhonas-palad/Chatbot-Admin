import { Outlet } from "react-router-dom";
import { useLocation,  } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import Sidebar from './Sidebar';


function Home() {
    const {auth} = useAuth();
    const location = useLocation();
    const {pathname} = location;
    return (
        <>
        <Sidebar/>
        {
            pathname === '/' ? (
                <div 
                    className='w-100 dflex-center'>
                        <h1>Hello {auth.full_name}</h1>
                        <p></p>
                </div> 
            ) : (
                <Outlet/>
            )
        }
        </>
    );
}

export default Home;