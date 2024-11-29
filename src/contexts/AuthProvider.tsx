import { message } from "antd";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string /* , user: User */) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); // Authentication check complete
  }, []);

  const login = (token: string /*  user: User */) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    /*    setUser(user); */
    setUser({ role: "ADMIN" });
    setIsAuthenticated(true);
    message.success("Login successful");
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading animation
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, hasRole }}
    >
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
