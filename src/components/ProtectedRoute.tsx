import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authStorage from '../utils/authStorage';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/auth'
}) => {
  const isAuthenticated = authStorage.isAuthenticated();
  const userRole = authStorage.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
