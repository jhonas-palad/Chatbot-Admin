import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import 'bootstrap/dist/css/bootstrap.css';
import '../css/main.css';
import '../css/sizing.css';

import NavigationBar from "./NavigationBar";


const Layout = () => {
    const {auth} = useAuth();
    useEffect(()=> {
        console.log("QWE:");
        console.log(auth);
    }, [auth]);
    return (
        <>
            <NavigationBar/>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout