import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthProvider";
import { message } from "antd";
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
    const hasRequiredRole = user && requiredRoles.includes(user.role as any);
    /*  console.log(user);
    if (!user?.token) {
      message.warning("You need to log in to access this page.");
      logout(location);
    } else if (!hasRequiredRole) {
      message.error(
        "You do not have the required permissions to access this page."
      );
      navigate("/unauthorized", { state: { from: location }, replace: true });
    }
 */
    setLoading(false);
  }, [user, requiredRoles, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
