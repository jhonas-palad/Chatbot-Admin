import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { IntentProvider } from '../context/IntentProvider';

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    return (
        auth?.access_token 
            ? (
            <IntentProvider>
                <Outlet />
            </IntentProvider>
        ) : ( 
        <Navigate to="/login" state={{from: location }} replace/>
        )
    );
}

export default RequireAuth;