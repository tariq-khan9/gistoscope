// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  userType: string;
  authType: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => void;
  logout: () => Promise<void>;

  editIndex: number;
  setEditIndex: React.Dispatch<React.SetStateAction<number>>;
  textareaEdit: boolean;
  setTextareaEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [editIndex, setEditIndex] = useState<number>(0);
  const [textareaEdit, setTextareaEdit] = useState<boolean>(false);

  // Check session on initial load
  useEffect(() => {
    // fetch request to get user from google auth.
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login/success`, {
      credentials: "include", // Important to include cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          console.log("google auth ", data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .catch((err) => console.error("Error fetching user:", err));

    // check local storage in both google and local auth
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    } else {
      setUser(null);
    }
  }, []);

  // Local login
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login-local`,
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      throw new Error("Invalid username or password");
    }
  };

  // Google login
  const googleLogin = () => {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  };

  // Logout
  const logout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(null); // Clear user data after successful logout
        localStorage.removeItem("user");

        // Redirect to the home page
        // window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        logout,
        editIndex,
        setEditIndex,
        textareaEdit,
        setTextareaEdit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useGlobalContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
