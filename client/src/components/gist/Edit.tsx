import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  CREATE_VERSION,
  CREATE_EDIT,
  DELETE_VERSION,
  GET_ALL_GISTS,
} from "../../services/graphql/queriesMutations";
import { EditType, VersionType } from "../../services/types";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import RichEditor from "../dashboard/RichEditor";

type EditProps = {
  edits: EditType[];
  versionData: VersionType;
  newVersionData: string;
  createVersion: boolean;
  setCreateVersion: (value: boolean) => void;
  setVersionIndex: (value: number) => void;
  versionsLength: number;
};

const Edit: React.FC<EditProps> = ({
  edits,
  versionData,
  newVersionData,
  createVersion,
  setCreateVersion,
  setVersionIndex,
  versionsLength,
}) => {
  const [createNewVersion] = useMutation(CREATE_VERSION, {
    refetchQueries: [{ query: GET_ALL_GISTS }],
  });

  const [deleteNewVersion] = useMutation(DELETE_VERSION, {
    refetchQueries: [{ query: GET_ALL_GISTS }],
  });

  const [createEdit] = useMutation(CREATE_EDIT, {
    refetchQueries: [{ query: GET_ALL_GISTS }],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState<string>("");

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % edits?.length);
  };

  const handleCreateVersion = async () => {
    setCreateVersion(!createVersion);
    //---------if  nothing has changed ---------------------
    if (
      newVersionData === versionData.point &&
      content === edits[currentIndex]?.body
    ) {
      console.log("nothing has changeed");
      return;
    }
    //---------if only version has changed ---------------------
    if (
      newVersionData !== versionData.point &&
      content === edits[currentIndex]?.body
    ) {
      try {
        const versionResponse = await createNewVersion({
          variables: {
            version: {
              gistId: versionData.gistId,
              point: newVersionData,
              userId: 1,
              createdAt: new Date().toISOString(),
            },
          },
        });

        var new_version_id = versionResponse.data.addVersion.id;

        if (new_version_id) {
          await createEdit({
            variables: {
              edit: {
                versionId: new_version_id,
                body: content,
                userId: 1,
                createdAt: new Date().toISOString(),
              },
            },
          });
        }
      } catch (e) {
        // if edit is not created, then delete the version as well.
        try {
          await deleteNewVersion({
            variables: {
              id: new_version_id,
            },
          });
        } catch (e) {
          console.log("version not created successfully");
        }
      }
      console.log("if only version has changed");
      return;
    }

    //---------if both have changed ---------------------

    if (
      newVersionData !== versionData.point &&
      content !== edits[currentIndex]?.body
    ) {
      try {
        const versionResponse = await createNewVersion({
          variables: {
            version: {
              gistId: versionData.gistId,
              point: newVersionData,
              userId: 1,
              createdAt: new Date().toISOString(),
            },
          },
        });

        var new_version_id = versionResponse.data.addVersion.id;

        if (new_version_id) {
          await createEdit({
            variables: {
              edit: {
                versionId: new_version_id,
                body: content,
                userId: 1,
                createdAt: new Date().toISOString(),
              },
            },
          });
        }
      } catch (e) {
        // if edit is not created, then delete the version as well.
        try {
          await deleteNewVersion({
            variables: {
              id: new_version_id,
            },
          });
        } catch (e) {
          console.log("version not created successfully");
        }
      }
      console.log("if both have changed");
      return;
    }

    //---------if only edit has changed ---------------------

    if (
      newVersionData === versionData.point &&
      content !== edits[currentIndex]?.body
    ) {
      if (createVersion) {
        await createEdit({
          variables: {
            edit: {
              versionId: versionData.id,
              body: content,
              userId: 1,
              createdAt: new Date().toISOString(),
            },
          },
        });
      }

      console.log("only edit has changeed");
      return;
    }
  };

  useEffect(() => {
    setCurrentIndex(0);
    setContent(edits[currentIndex]?.body);
  }, [edits]);

  useEffect(() => {
    setContent(edits[currentIndex]?.body);
  }, [currentIndex]);

  return (
    <div>
      <div className="w-full flex flex-col justify-between px-10 py-4 rounded-lg">
        <div className="user-arrow-btn  flex flex-row w-full  justify-between">
          <div className="flex flex-row space-x-4 items-center justify-center">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="flex flex-col">
              <h1
                onClick={() => console.log(content, edits[currentIndex].body)}
                className="text-[16px] text-slate-500 uppercase"
              >
                {" "}
                user
              </h1>
              <h2 className="text-[12px] text-slate-600">12-03-2024</h2>
            </div>
          </div>

          <div className="flex flex-row text-[14px] justify-center items-center  space-x-[6px]">
            <button
              onClick={() => handleCreateVersion()}
              className={`border border-gray-600 hover:bg-sky-800 hover:text-white rounded-full w-24 h-6 text-[12px] mr-2`}
            >
              {!createVersion ? "Edit body" : "Save body"}
            </button>

            <button
              className="arrow"
              disabled={currentIndex === 0}
              onClick={handlePrev}
            >
              <IoIosArrowDropleft className="arrow" />
            </button>

            <div className="flex flex-row  font-semibold justify-center text-slate-500 ">
              {currentIndex + 1}
              <h1 className="mx-1">/</h1>
              {edits?.length}
            </div>

            <button
              className="arrow"
              disabled={currentIndex + 1 === edits?.length}
              onClick={handleNext}
            >
              <IoIosArrowDropright className="arrow" />
            </button>
          </div>
        </div>

        {edits?.length > 0 && (
          <div className="mt-4">
            <RichEditor
              editable={!createVersion}
              content={content}
              setContent={setContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
