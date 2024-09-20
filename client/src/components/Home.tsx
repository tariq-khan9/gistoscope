import React from 'react';
import Sidebar from './Sidebar';
import IndexGist from './gist/IndexGist';
import Navbar from './Navbar';


const Home = () => {

  
  
  return (
    <div className="flex flex-row  overflow-hidden">
      <div className="w-[20%] h-full ">
        <Sidebar />
      </div>
      <div className="w-[80%] h-screen overflow-auto">
        <IndexGist />
      </div>
    </div>
  );
};

export default Home;
