import React, { useState } from "react";
import CreateUser from "./user/CreateUser";
import CreateGist from "./gist/CreateGist";
import SingleGist from "./gist/SingleGist";
import IndexGist from "../gist/IndexGist";

const sideNavigations = [
  "User",
  "Create User",
  "All Gist",
  "Create Gist",
  "Single Gist",
];

const Index = () => {
  const [showComponent, setShowComponent] = useState<number>(0);
  return (
    <div className="flex flex-row w-full ">
      <div className="w-[20%] h-full border border-gray-500 flex flex-col items-start space-y-4 py-10 px-8">
        {sideNavigations.map((nav, index) => (
          <button onClick={() => setShowComponent(index + 1)} key={index}>
            {nav}
          </button>
        ))}
      </div>
      <div className="w-[80%]">
        {showComponent == 2 && <CreateUser />}
        {showComponent == 4 && <CreateGist />}

        {showComponent == 5 && <SingleGist />}
      </div>
    </div>
  );
};

export default Index;
