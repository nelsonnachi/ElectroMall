import React from 'react'
import { useSelector } from "react-redux";
import WaveLoader from "./WaveLoader";
import { Navigate, useLocation } from 'react-router-dom'; 

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.user);
    const location = useLocation(); 

    if (loading) {
        return <WaveLoader />
    }

    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return element;
}

export default ProtectedRoute;
