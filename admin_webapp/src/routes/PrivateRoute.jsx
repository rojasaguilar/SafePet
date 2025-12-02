import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const loggedUser = sessionStorage.getItem('loggedUser');

  if (!loggedUser) { 
    return <Navigate to= "/landing" replace/>
  }

  return children;
}

export default PrivateRoute;
