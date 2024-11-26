// src/guards/AuthGuard.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles: Array<"ADMIN" | "COMPANY_ADMIN" | "BRANCH_ADMIN">;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth();

  const hasRequiredRole = user && requiredRoles.includes(user.role as any);

  if (!isAuthenticated || !hasRequiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
