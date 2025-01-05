import React from "react";
import Sidebar from "./Sidebar";
import IndexGist from "./gist/IndexGist";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="flex flex-row w-full bg-gray-400   overflow-hidden">
      {/* <div className="w-[20%] h-full ">
        <Sidebar />
      </div> */}
      <div className="w-full mt-10  flex justify-center  overflow-auto">
        <IndexGist />
      </div>
    </div>
  );
};

export default Home;
