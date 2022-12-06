import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

import CenterSpinner from "./CenterSpinner";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }
        if(!auth.access_token){
            verifyRefreshToken();
        }else{
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <CenterSpinner/>
                ) : ( 
                    <Outlet/>
                )

            }
            
            
        </>
    )
}

export default PersistLogin