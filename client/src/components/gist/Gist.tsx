import React, { useState } from "react";
import { GistType } from "../../services/types";
import Version from "./Version";
import BoxWithShadows from "../others/BoxWithShadow";
import { sortGistsByTime } from "../../services/utils/sortGistsByTime";
import Navigation from "../others/Navigation";

type GistProps = {
  gists: GistType[]; // Define the expected type for the gists prop
};

const Gist: React.FC<GistProps> = ({ gists }) => {
  const sortedGists = sortGistsByTime(gists, "desc");

  const [showChild, setShowChild] = useState(false);

  const [gistCurrentIndex, setGistCurrentIndex] = useState<number>(0);
  const [versionCurrentIndex, setVersionCurrentIndex] = useState<number>(0);
  const [editCurrentIndex, setEditCurrentIndex] = useState<number>(0);

  const handleNext = () => {
    setGistCurrentIndex((prevIndex) => (prevIndex + 1) % gists?.length);
    setVersionCurrentIndex(0);
    setEditCurrentIndex(0);
  };

  const handlePrev = () => {
    setGistCurrentIndex((prevIndex) => (prevIndex - 1) % gists?.length);
    setVersionCurrentIndex(0);
    setEditCurrentIndex(0);
  };

  const handleIndexChange = (newIndex: number) => {
    setGistCurrentIndex(newIndex);
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
                {gists[gistCurrentIndex]?.title}
              </h1>
            </div>
          )}

          <div className="post-arrow-buttons flex flex-row items-center justify-center space-x-2">
            {gists && gists[gistCurrentIndex].gists.length > 0 && (
              <button
                className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full px-[16px] h-5 text-[10px]`}
                onClick={() => setShowChild(!showChild)}
              >
                {showChild ? "Hide Reply" : "Show Reply"}
              </button>
            )}

            <Navigation
              currentIndex={gistCurrentIndex}
              totalItems={gists.length}
              onChangeIndex={handleIndexChange}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </div>
        </div>
      </BoxWithShadows>

      <BoxWithShadows
        visible={gists[gistCurrentIndex].versions.length > 1}
        boxBorder="border-amber-300"
        colorShades={["bg-amber-200", "bg-amber-100", "bg-amber-50"]}
      >
        {gists[gistCurrentIndex].versions && (
          <Version
            versions={sortedGists[gistCurrentIndex].versions}
            editCurrentIndex={editCurrentIndex}
            setEditCurrentIndex={setEditCurrentIndex}
            versionCurrentIndex={versionCurrentIndex}
            setVersionCurrentIndex={setVersionCurrentIndex}
            gistCurrentIndex={gistCurrentIndex}
          />
        )}
      </BoxWithShadows>

      <div className={`${showChild ? "flex w-full" : "hidden"}`}>
        {gists[gistCurrentIndex].gists &&
          gists[gistCurrentIndex].gists.length > 0 && (
            <Gist gists={sortedGists[gistCurrentIndex].gists} />
          )}
      </div>
    </div>
  );
};

export default Gist;
