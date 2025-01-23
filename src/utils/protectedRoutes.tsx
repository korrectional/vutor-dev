import { Outlet, Navigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const ProtectedRoutes = () => {
    const user = useIsAuthenticated();
    return user ? <Outlet/> : <Navigate to="/signin"/>
}

export default ProtectedRoutes;