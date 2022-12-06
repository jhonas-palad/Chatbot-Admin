import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLocation,  } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import Sidebar from './Sidebar';


function Home() {
    const {auth} = useAuth();
    const location = useLocation();
    const {pathname} = location;
    console.log(auth);
    return (
        <>
        <Sidebar/>
        {
            pathname === '/' ? (
                <div 
                    className='w-100'>
                        Hello {auth.full_name}
                </div> 
            ) : (
                <Outlet/>
            )
        }
        </>
    );
}

export default Home;