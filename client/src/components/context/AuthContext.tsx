// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { GET_GISTS_BY_SUBJECT } from "../../services/graphql/queriesMutations";
import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";

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
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/auth/session`,
          {
            withCredentials: true,
          }
        );
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
        `${process.env.REACT_APP_SERVER_URL}/auth/login-local`,
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
        console.log(response.data.message); // Optional: Log the response message

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
