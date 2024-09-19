import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import User from './components/User';
import Index from './components/dashboard/Index';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User/>} />
        <Route path="/dashboard" element={<Index/>} />
      </Routes>
    </Router>
  );
};

export default App;
