import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLocation,  } from "react-router-dom";

import Sidebar from './Sidebar';


function Home() {

    const location = useLocation();
    const {pathname} = location;
    useEffect(()=>{
        console.log("Location");
        console.log(location);
    }, [location]);
    return (
        <>
        <Sidebar/>
        {
            pathname === '/' ? (
                <div className='w-100'>You can create and modify intents on the left panel</div> 
            ) : (
                <Outlet/>
            )
        }
        </>
    );
}

export default Home;