import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/AuthContext";
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
import Navigation from "../others/Navigation";

type VerionProps = {
  versions: VersionType[];
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const Version: React.FC<VerionProps> = ({ versions }) => {
  const { user, versionIndex, setVersionIndex, textareaEdit, setTextareaEdit } =
    useGlobalContext();
  const [vcurrentIndex, setversionIndex] = useState(0);
  const [createVersion, setCreateVersion] = useState(false);
  const [newVersionData, setNewVersionData] = useState<string>(
    versions[versionIndex]?.point
  );

  const [createNewVersion] = useMutation(CREATE_VERSION, {
    refetchQueries: [{ query: GET_ALL_GISTS }],
  });

  const handleNext = () => {
    setVersionIndex((prevIndex) => (prevIndex + 1) % versions?.length);
  };

  const handlePrev = () => {
    setVersionIndex((prevIndex) => (prevIndex - 1) % versions?.length);
  };

  const handleIndexChange = (newIndex: number) => {
    setVersionIndex(newIndex);
  };

  const handleCreateVersion = async () => {
    setCreateVersion(!createVersion);

    if (newVersionData === versions[versionIndex].point) {
      return;
    }

    if (createVersion) {
      try {
        await createNewVersion({
          variables: {
            version: {
              gistId: versions[versionIndex].gistId,
              point: newVersionData,
              userId: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }).then(() => {
          setVersionIndex(versions.length - 1);
        });
      } catch (e) {
        console.log("new version not created.", e);
      }
    }
  };

  useEffect(() => {
    if (!createVersion) {
      setNewVersionData(versions[versionIndex].point);
    }
  }, [versions, versionIndex, createVersion]);

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
                {versions[versionIndex]?.user?.name}
              </h1>
              <h2 className="text-[12px] text-slate-600">
                {dateFormatter.format(
                  Date.parse(versions[versionIndex].createdAt)
                )}
              </h2>
            </div>
          </div>
          <div className="flex justify-end">
            <Navigation
              currentIndex={versionIndex}
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
        visible={versions[versionIndex]?.edits?.length > 1}
        boxBorder="border-slate-300"
        colorShades={["bg-white", "bg-slate-100", "bg-slate-50"]}
      >
        {versions[versionIndex].edits && (
          <Edit
            edits={versions[versionIndex].edits}
            versionData={versions[versionIndex]}
            newVersionData={newVersionData}
            createVersion={createVersion}
            setCreateVersion={setCreateVersion}
            setVersionIndex={setversionIndex}
            versionsLength={versions.length}
          />
        )}
      </BoxWithShadows>
    </div>
  );
};

export default Version;
