// src/guards/AuthGuard.tsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles: Array<"ADMIN" | "COMPANY_ADMIN" | "BRANCH_ADMIN">;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasRequiredRole = user && requiredRoles.includes(user.role as any);

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
    } else if (!hasRequiredRole) {
      navigate("/unauthorized", { state: { from: location }, replace: true });
    }

    setLoading(false);
  }, [requiredRoles, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
