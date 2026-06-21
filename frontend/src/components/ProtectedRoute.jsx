import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import WaveLoader from "./WaveLoader";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({element}) => {
    const {isAuthenticated, loading} = useSelector((state)=> state.user)
    if(loading){
        return <WaveLoader />
    }

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
  return element
}

export default ProtectedRoute