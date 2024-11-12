import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./components/dashboard/Index";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CreateGist from "./components/dashboard/gist/CreateGist";
import SubjectTree from "./components/subject/SubjectTree";

import Profile from "./components/auth/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Login from "./components/auth/Login";

const App: React.FC = () => {
  return (
    <Router>
      <div className="mb-[60px]">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/sub" element={<SubjectTree />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
