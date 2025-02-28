import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";


export default function PrivateRoute() {
    const { me } = useAuth();
    
    return me ? <Outlet/> : <Navigate to="/sign-in"/>;
}