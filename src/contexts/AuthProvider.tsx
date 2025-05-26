import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { loginWithUpdate } from "utils/permissionUtils";

interface AuthContextType {
  user: User | null;
  login: (user: User, from: string) => void;
  logout: (location: any) => void;
  hasRole: (role: string) => boolean;
}

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (user: any, from: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    const res = loginWithUpdate(from);
    if (res) {
      message.success("Login successful");
    } /*  else {
      message.warning("Failed to load user info ");
    } */
  };

  const logout = (location: any = window.location.pathname) => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login", { state: { from: location }, replace: true });
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
