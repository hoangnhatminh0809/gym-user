import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    const token = localStorage.getItem('access_token');

    if (!token && !isAuthenticated && location.pathname !== '/login') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;