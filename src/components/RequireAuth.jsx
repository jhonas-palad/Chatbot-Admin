import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const RequireAuth = () => {
    const { auth, setAuth } = useAuth();
    const location = useLocation();

    return (
        auth?.access_token 
            ? <Outlet />
            : <Navigate to="/login" state={{from: location }} replace/>
    );
}

export default RequireAuth;