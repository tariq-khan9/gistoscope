import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { VersionType } from "../../services/types";

import Edit from "./Edit";
import BoxWithShadows from "../others/BoxWithShadow";
import TextareaWithLimit from "../others/TextareaWithLimit";
import Navigation from "../others/Navigation";
import { useSwipeable } from "react-swipeable";

type VerionProps = {
  versions: VersionType[];
  gistLength: number;
  gistCurrentIndex: number;
  editCurrentIndex: number;
  setEditCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  versionCurrentIndex: number;
  setVersionCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const Version: React.FC<VerionProps> = ({
  versions,
  editCurrentIndex,
  gistLength,
  setEditCurrentIndex,
  versionCurrentIndex,
  setVersionCurrentIndex,
  gistCurrentIndex,
}) => {
  const [createVersion, setCreateVersion] = useState(false);
  const [newVersionData, setNewVersionData] = useState<string>(
    versions[versionCurrentIndex]?.point
  );

  const { setTextareaEdit, user, textareaEdit } = useGlobalContext();

  const handleNext = () => {
    setVersionCurrentIndex((prevIndex) => (prevIndex + 1) % versions?.length);
  };

  const handlePrev = () => {
    setVersionCurrentIndex((prevIndex) =>
      prevIndex === 0 ? versions.length - 1 : prevIndex - 1
    );
  };

  const handleIndexChange = (newIndex: number) => {
    setVersionCurrentIndex(newIndex);
  };

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true, // Enable mouse dragging
  });
  useEffect(() => {
    setVersionCurrentIndex(0);
  }, [gistCurrentIndex]);

  useEffect(() => {
    if (!createVersion) {
      setNewVersionData(versions[versionCurrentIndex].point);
    }
  }, [versions, versionCurrentIndex, createVersion]);

  if (!versions || versions.length === 0) {
    return <div>No Versions available.</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-lg">
      <div className="w-full  h-32 p-2 flex flex-col sm:flex-row justify-start sm:px-4 sm:space-x-4">
        <div className="w-full sm:w-[75%] " {...handleSwipe}>
          {versions?.length > 0 && (
            <div className=" w-full ">
              {textareaEdit ? (
                // <textarea className=' w-full h-full outline-none border-none focus:ring-0 focus:outline-none' value={newVersionData} onChange={(e)=>setNewVersionData(e.target.value)} />
                <TextareaWithLimit
                  maxChars={300}
                  text={newVersionData}
                  setText={setNewVersionData}
                />
              ) : (
                <h1
                  onDoubleClick={() => user && setTextareaEdit(true)}
                  className="text-slate-800 text-[12px] sm:text-[14px] lg:text-[16px]"
                >
                  {newVersionData}
                </h1>
              )}
            </div>
          )}
        </div>

        {/*--------------------- textarea end here ----------------------------------*/}

        <div className="user-arrow-btn mt-8  sm:mt-0 w-full sm:w-[25%]  flex flex-row sm:flex-col justify-between sm:justify-start sm:space-y-8 sm:border-l border-amber-400 sm:pl-4">
          <div className="flex justify-start flex-row space-x-2 sm:space-x-4 items-center ">
            <img
              src={versions[versionCurrentIndex]?.user?.image || "/profile.png"}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              alt="imgae"
            />
            <div className="flex flex-col">
              <h1 className="text-[13px] sm:text-[14px] lg:text-[16px] text-slate-700 uppercase">
                {versions[versionCurrentIndex]?.user?.name}
              </h1>
              <h2 className="text-[10px] sm:text-[12px] text-slate-600">
                {dateFormatter.format(
                  Date.parse(versions[versionCurrentIndex].createdAt)
                )}
              </h2>
            </div>
          </div>
          <div className="flex justify-end">
            <Navigation
              currentIndex={versionCurrentIndex}
              totalItems={versions.length}
              onChangeIndex={handleIndexChange}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </div>
        </div>
      </div>
      {/*---------------------------------- edit section starts here -------------------------------------*/}
      <BoxWithShadows
        visible={versions[versionCurrentIndex]?.edits?.length > 1}
        boxBorder="border-slate-300"
        colorShades={["bg-white", "bg-slate-100", "bg-slate-50"]}
      >
        {versions[versionCurrentIndex].edits && (
          <Edit
            edits={versions[versionCurrentIndex].edits}
            versionData={versions[versionCurrentIndex]}
            newVersionData={newVersionData}
            createVersion={createVersion}
            setCreateVersion={setCreateVersion}
            versionsLength={versions.length}
            versionCurrentIndex={versionCurrentIndex}
            setVersionCurrentIndex={setVersionCurrentIndex}
            editCurrentIndex={editCurrentIndex}
            setEditCurrentIndex={setEditCurrentIndex}
            gistCurrentIndex={gistCurrentIndex}
            gistLength={gistLength}
          />
        )}
      </BoxWithShadows>
    </div>
  );
};

export default Version;
