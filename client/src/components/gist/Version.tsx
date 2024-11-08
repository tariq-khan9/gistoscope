import React, { useState, useEffect, useRef } from "react";
import { GistType, VersionType } from "../../services/types";
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import {
  CREATE_VERSION,
  CREATE_EDIT,
  GET_ALL_GISTS,
} from "../../services/graphql/queriesMutations";
import Edit from "./Edit";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import BoxWithShadows from "../others/BoxWithShadow";
import TextareaWithLimit from "../others/TextareaWithLimit";
import ReplyModal from "../others/ReplyModal";

type VerionProps = {
  versions: VersionType[];
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const Version: React.FC<VerionProps> = ({ versions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [createVersion, setCreateVersion] = useState(false);
  const [newVersionData, setNewVersionData] = useState<string>(
    versions[currentIndex]?.point
  );

  const [createNewVersion] = useMutation(CREATE_VERSION, {
    refetchQueries: [{ query: GET_ALL_GISTS }],
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % versions?.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % versions?.length);
  };

  const handleCreateVersion = async () => {
    setCreateVersion(!createVersion);

    if (newVersionData === versions[currentIndex].point) {
      return;
    }

    if (createVersion) {
      try {
        await createNewVersion({
          variables: {
            version: {
              gistId: versions[currentIndex].gistId,
              point: newVersionData,
              userId: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }).then(() => {
          setCurrentIndex(versions.length - 1);
        });
      } catch (e) {
        console.log("new version not created.", e);
      }
    }
  };

  useEffect(() => {
    if (!createVersion) {
      setNewVersionData(versions[currentIndex].point);
    }
  }, [versions, currentIndex, createVersion]);

  if (!versions || versions.length === 0) {
    return <div>No Versions available.</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-lg">
      <div className="w-full h-32 p-2 flex flex-row justify-start px-4 space-x-4">
        <div className="user-arrow-btn  flex flex-col justify-start space-y-8 border-r border-amber-400 pr-4">
          <div className="flex flex-row space-x-4 items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
            <div className="flex flex-col">
              <h1 className="text-[16px] text-slate-700 uppercase">
                {versions[currentIndex]?.user?.name}
              </h1>
              <h2 className="text-[12px] text-slate-600">
                {dateFormatter.format(
                  Date.parse(versions[currentIndex].createdAt)
                )}
              </h2>
            </div>
          </div>

          <div className="flex flex-row text-[14px]">
            <button
              className="arrow"
              disabled={currentIndex === 0 || createVersion}
              onClick={handlePrev}
            >
              <IoIosArrowDropleft className="arrow" />
            </button>

            <div className="flex flex-row mx-[2px] font-semibold justify-center text-slate-500 ">
              {currentIndex + 1}
              <h1 className="mx-[4px]">/</h1>
              {versions?.length}
            </div>

            <button
              className="arrow"
              disabled={currentIndex + 1 === versions?.length || createVersion}
              onClick={handleNext}
            >
              <IoIosArrowDropright className="arrow" />
            </button>
          </div>
        </div>

        {versions?.length > 0 && (
          <div className="text-[14px] w-full ">
            {createVersion ? (
              // <textarea className=' w-full h-full outline-none border-none focus:ring-0 focus:outline-none' value={newVersionData} onChange={(e)=>setNewVersionData(e.target.value)} />
              <TextareaWithLimit
                maxChars={300}
                text={newVersionData}
                setText={setNewVersionData}
              />
            ) : (
              <h1 className="text-slate-800 text-[16px]">{newVersionData}</h1>
            )}
          </div>
        )}
      </div>

      <BoxWithShadows
        visible={versions[currentIndex].edits.length > 1}
        boxBorder="border-slate-300"
        colorShades={["bg-white", "bg-slate-100", "bg-slate-50"]}
      >
        {versions[currentIndex].edits && (
          <Edit
            edits={versions[currentIndex].edits}
            versionData={versions[currentIndex]}
            newVersionData={newVersionData}
            createVersion={createVersion}
            setCreateVersion={setCreateVersion}
            setVersionIndex={setCurrentIndex}
            versionsLength={versions.length}
          />
        )}
      </BoxWithShadows>
    </div>
  );
};

export default Version;
