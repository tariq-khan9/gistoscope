import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GistType } from "../../services/types";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import Version from "./Version";
import BoxWithShadows from "../others/BoxWithShadow";
import EditModal from "../others/ReplyModal";
import { sortGistsByTime } from "../../services/utils/sortGistsByTime";
import Navigation from "../others/Navigation";

type GistProps = {
  gists: GistType[]; // Define the expected type for the gists prop
};

const Gist: React.FC<GistProps> = ({ gists }) => {
  const { setVersionIndex } = useGlobalContext();
  const sortedGists = sortGistsByTime(gists, "desc");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChild, setShowChild] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gists?.length);
    setVersionIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % gists?.length);
    setVersionIndex(0);
  };

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    // loadGistData(newIndex);
  };

  if (!gists || gists.length === 0) {
    return <div>No Gists available.</div>;
  }

  return (
    <div className="flex w-full flex-col mt-10 ">
      <BoxWithShadows
        visible={gists.length > 1}
        boxBorder="border-amber-500"
        colorShades={["bg-amber-300", "bg-amber-200", "bg-amber-100"]}
      >
        <div className="w-full p-3 flex flex-row justify-between px-8 rounded-lg">
          {gists?.length > 0 && (
            <div className="">
              <h1 className="text-[16px] uppercase">
                {gists[currentIndex]?.title}
              </h1>
            </div>
          )}

          <div className="post-arrow-buttons flex flex-row items-center justify-center space-x-2">
            {gists[currentIndex].gists.length > 0 && (
              <button
                className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full px-[16px] h-5 text-[10px]`}
                onClick={() => setShowChild(!showChild)}
              >
                {showChild ? "Hide Reply" : "Show Reply"}
              </button>
            )}

            {/* <div className="flex flex-row text-[14px]  justify-center  space-x-[6px]">
              <button
                className="arrow"
                disabled={currentIndex === 0}
                onClick={handlePrev}
              >
                <IoIosArrowDropleft className="arrow" />
              </button>

              <div className="flex flex-row  font-semibold text-slate-500 justify-center ">
                <span>{currentIndex + 1}</span>
                <h1 className="mx-1 ">/</h1>
                {gists?.length}
              </div>

              <button
                className="arrow"
                disabled={currentIndex + 1 === gists?.length}
                onClick={handleNext}
              >
                <IoIosArrowDropright className="arrow" />
              </button>
            </div> */}
            <Navigation
              currentIndex={currentIndex}
              totalItems={gists.length}
              onChangeIndex={handleIndexChange}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </div>
        </div>
      </BoxWithShadows>

      <BoxWithShadows
        visible={gists[currentIndex].versions.length > 1}
        boxBorder="border-amber-300"
        colorShades={["bg-amber-200", "bg-amber-100", "bg-amber-50"]}
      >
        {gists[currentIndex].versions && (
          <Version versions={sortedGists[currentIndex].versions} />
        )}
      </BoxWithShadows>

      <div className={`${showChild ? "flex w-full" : "hidden"}`}>
        {gists[currentIndex].gists && gists[currentIndex].gists.length > 0 && (
          <Gist gists={sortedGists[currentIndex].gists} />
        )}
      </div>
    </div>
  );
};

export default Gist;
