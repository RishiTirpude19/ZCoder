import React from 'react'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

function PreventRoute({children}) {
    const token = localStorage.getItem("token");
    console.log(token);
    return !token ? children : <Navigate to="/dashboard" />;
}

export default PreventRoute
