// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/session", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Local login
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/auth/login-local",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
    } catch (error) {
      throw new Error("Invalid username or password");
    }
  };

  // Google login
  const googleLogin = () => {
    window.open("http://localhost:4000/auth/google", "_self");
  };

  // Logout
  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(null); // Clear user data after successful logout
        console.log(response.data.message); // Optional: Log the response message

        // Redirect to the home page
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
