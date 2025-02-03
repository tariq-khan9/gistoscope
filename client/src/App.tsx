import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./components/dashboard/Index";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CreateGist from "./components/dashboard/gist/CreateGist";

import Profile from "./components/auth/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import { TreePage } from "./components/TreePage/TreePage";
import TreeIndex from "./components/TreePage/TreeIndex";
import SubjectTree from "./components/subject/SubjectTree";

const App: React.FC = () => {
  return (
    <Router>
      <div className="mb-[60px] fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <Navbar />
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/" element={<SubjectTree />} />
        <Route path="/:type/:title/:id" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/login/:token" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
