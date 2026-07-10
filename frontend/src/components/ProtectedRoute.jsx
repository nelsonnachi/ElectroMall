import React from 'react'
import { useSelector } from "react-redux";
import WaveLoader from "./WaveLoader";
import { Navigate, useLocation } from 'react-router-dom'; 

const ProtectedRoute = ({ element, adminOnly = false }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.user);
    const location = useLocation(); 

    if (loading) {
        return <WaveLoader />
    }

    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    if(adminOnly && user.role !== 'admin'){
        return <Navigate to='/' />
    }

    return element;
}

export default ProtectedRoute;
