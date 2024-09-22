import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from './components/dashboard/Index';
import Home from './components/Home';
import Navbar from './components/Navbar';
import CreateGist from './components/dashboard/gist/CreateGist';



const App: React.FC = () => {
  return (
    <Router>
      <div className='mb-[60px]'>
         <Navbar/>
      </div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Index/>} />
        <Route path="/reply/:id" element={<CreateGist/>} />
      </Routes>
    </Router>
  );
};

export default App;
