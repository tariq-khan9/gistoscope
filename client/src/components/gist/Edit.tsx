import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaRegSave, FaEdit } from "react-icons/fa";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_VERSION,
  CREATE_EDIT,
  DELETE_VERSION,
  GET_ALL_GISTS,
  GET_COMMENT,
} from "../../services/graphql/queriesMutations";
import { EditType, VersionType } from "../../services/types";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import RichEditor from "../dashboard/RichEditor";
import ReplyModal from "../others/ReplyModal";
import CountComponent from "../others/CountComponent";
import FlagComponent from "../others/FlagComponent";
import FavComponent from "../others/FavComponent";
import SingleComment from "../comments/SingleComment";
import SendComment from "../comments/SendComment";
import CommentWrapper from "../comments/CommentWrapper";

type EditProps = {
  edits: EditType[];
  versionData: VersionType;
  newVersionData: string;
  createVersion: boolean;
  setCreateVersion: (value: boolean) => void;
  setVersionIndex: (value: number) => void;
  versionsLength: number;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const Edit: React.FC<EditProps> = ({
  edits,
  versionData,
  newVersionData,
  createVersion,
  setCreateVersion,
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

  const {
    data,
    loading,
    refetch: refetchComments,
  } = useQuery(GET_COMMENT, {
    variables: {
      editId: edits[currentIndex].id,
    },
  });

  const [content, setContent] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const { user } = useAuth();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length);
    console.log(edits[currentIndex]);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % edits?.length);
  };

  const handleRefetchComments = () => {
    refetchComments();
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
    refetchComments({ editId: edits[currentIndex].id });
  }, [currentIndex]);

  if (loading) return <h1>loading...</h1>;

  return (
    <div>
      <div className="w-full flex flex-col justify-between px-10 py-4 rounded-lg">
        <div className="user-arrow-btn  flex flex-row w-full  justify-between">
          <div className="flex flex-row space-x-4 items-center justify-center">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="flex flex-col">
              <h1 className="text-[16px] text-slate-500 uppercase">
                {" "}
                {edits[currentIndex].user.name}
              </h1>
              <h2 className="text-[12px] text-slate-600">
                {dateFormatter.format(
                  Date.parse(edits[currentIndex].createdAt)
                )}
              </h2>
            </div>
          </div>

          <div className="flex flex-row text-[14px] justify-center items-center  space-x-6">
            <div className="flex flex-row text-sky-900 justify-center align-middle items-center space-x-5 text-[20px]">
              <CountComponent
                label="N"
                count={edits[currentIndex].newnessCount}
                editId={edits[currentIndex].id}
              />
              <CountComponent
                label="I"
                count={edits[currentIndex].importantCount}
                editId={edits[currentIndex].id}
              />
              <CountComponent
                label="Q"
                count={edits[currentIndex].qualityCount}
                editId={edits[currentIndex].id}
              />
              <FlagComponent
                flag={edits[currentIndex].flag}
                editId={edits[currentIndex].id}
              />
              <FavComponent editId={edits[currentIndex].id} />

              <button
                disabled={!user}
                onClick={() => handleCreateVersion()}
                className="text-gray-500 hover:text-gray-400"
              >
                {!createVersion ? <FaEdit size={20} /> : <FaRegSave />}
              </button>
            </div>

            <div className="nav-buttons flex flex-row text-[14px] justify-center items-center  space-x-[4px]">
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

      <div className="comments and reply px-10 py-4">
        <SendComment
          setShowModal={setShowModal} // show button for reply modal
          editId={edits[currentIndex].id}
          userId={edits[currentIndex].user.id}
          handleRefetchComments={handleRefetchComments}
        />
      </div>

      <div className="show all comments  px-10 py-4 max-h-[500px] overflow-y-auto">
        <CommentWrapper
          comments={data.comments}
          userId={edits[currentIndex].user.id}
          editId={edits[currentIndex].id}
          handleRefetchComments={handleRefetchComments}
        />
      </div>

      {showModal && (
        <ReplyModal gist_id={versionData.gistId} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default Edit;
