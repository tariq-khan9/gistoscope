import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { VersionType } from "../../services/types";

import Edit from "./Edit";
import BoxWithShadows from "../others/BoxWithShadow";
import TextareaWithLimit from "../others/TextareaWithLimit";
import Navigation from "../others/Navigation";

type VerionProps = {
  versions: VersionType[];
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
    setVersionCurrentIndex((prevIndex) => (prevIndex - 1) % versions?.length);
  };

  const handleIndexChange = (newIndex: number) => {
    setVersionCurrentIndex(newIndex);
  };
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
      <div className="w-full h-32 p-2 flex flex-row justify-start px-4 space-x-4">
        <div className="w-[75%] ">
          {versions?.length > 0 && (
            <div className="text-[14px] w-full ">
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
                  className="text-slate-800 text-[16px]"
                >
                  {newVersionData}
                </h1>
              )}
            </div>
          )}
        </div>

        {/*--------------------- textarea end here ----------------------------------*/}

        <div className="user-arrow-btn w-[25%]  flex flex-col justify-start space-y-8 border-l border-amber-400 pl-4">
          <div className="flex flex-row space-x-4 items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
            <div className="flex flex-col">
              <h1 className="text-[16px] text-slate-700 uppercase">
                {versions[versionCurrentIndex]?.user?.name}
              </h1>
              <h2 className="text-[12px] text-slate-600">
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
          />
        )}
      </BoxWithShadows>
    </div>
  );
};

export default Version;
