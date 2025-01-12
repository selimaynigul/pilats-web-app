import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthProvider";
import { message, Spin } from "antd";
import { getToken, hasRole } from "utils/permissionUtils";
interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles: Array<"ADMIN" | "COMPANY_ADMIN" | "BRANCH_ADMIN">;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = hasRole(requiredRoles);
    if (!getToken()) {
      message.warning("You need to log in to access this page.");
      logout(location);
    } else if (!isAuthenticated) {
      message.error(
        "You do not have the required permissions to access this page."
      );
      navigate("/unauthorized", { state: { from: location }, replace: true });
    }

    setLoading(false);
  }, [user, requiredRoles, location]);

  if (loading) {
    return <Spin />;
  }

  return <>{children}</>;
};

export default AuthGuard;
