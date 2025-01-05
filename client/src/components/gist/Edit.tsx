import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { FaRegSave } from "react-icons/fa";
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
import { CgCloseR } from "react-icons/cg";
import RichEditor from "../dashboard/RichEditor";
import ReplyModal from "../others/ReplyModal";
import CountComponent from "../others/CountComponent";
import FlagComponent from "../others/FlagComponent";
import FavComponent from "../others/FavComponent";
import SendComment from "../comments/SendComment";
import CommentWrapper from "../comments/CommentWrapper";
import { Modal } from "antd";

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

const Edit: React.FC<EditProps> = ({ edits, versionData, newVersionData }) => {
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

  const [fetchComments, setFetchComments] = useState(false);

  const {
    data,
    loading,
    refetch: refetchComments,
  } = useQuery(GET_COMMENT, {
    skip: !fetchComments, // Skip query execution if fetchComments is false
    variables: { editId: edits[currentIndex].id },
  });

  const [content, setContent] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [richtextEdit, setRichtextEdit] = useState<boolean>(false);

  const { user, textareaEdit, setTextareaEdit } = useGlobalContext();

  const handleNext = () => {
    setFetchComments(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % edits?.length);
  };

  const handleRefetchComments = () => {
    refetchComments();
  };

  const handleLoadComments = () => {
    setFetchComments(true);
  };

  const handleCreateVersion = async () => {
    if (!newVersionData) {
      Modal.error({
        title: "Validation Error",
        content: "Version cannot be empty",
      });
      return;
    }
    //---------if  nothing has changed ---------------------
    if (
      newVersionData === versionData.point &&
      content === edits[currentIndex]?.body
    ) {
      console.log("nothing has changeed");
      setRichtextEdit(false);
      setTextareaEdit(false);
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
      setTextareaEdit(false);
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
      setRichtextEdit(false);
      setTextareaEdit(false);
      return;
    }

    //---------if only edit has changed ---------------------

    if (
      newVersionData === versionData.point &&
      content !== edits[currentIndex]?.body
    ) {
      if (richtextEdit) {
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
      setRichtextEdit(false);
      return;
    }
  };

  const handleCancelCreateVersion = () => {
    newVersionData = versionData.point;
    setContent(edits[currentIndex].body);
    setRichtextEdit(false);
    setTextareaEdit(false);
  };

  useEffect(() => {
    setCurrentIndex(0);
    setContent(edits[currentIndex]?.body);
  }, [edits]);

  useEffect(() => {
    setContent(edits[currentIndex]?.body);
  }, [currentIndex]);

  if (loading) return <h1>loading...</h1>;

  return (
    <div>
      <div className="w-full flex flex-col justify-between px-10 py-4 rounded-lg">
        <div className="user-arrow-btn  flex flex-row w-full  justify-between">
          <div className="flex flex-row space-x-4 items-center justify-center">
            <img
              src={edits[currentIndex].user.image}
              className="h-10 w-10 rounded-full"
              alt="imgae"
            />
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
              {(richtextEdit || textareaEdit) && user && (
                <div className="flex justify-center">
                  <button
                    disabled={!user}
                    onClick={() => handleCancelCreateVersion()}
                    className="text-gray-500 hover:text-gray-400 pt-[2px]"
                  >
                    {<CgCloseR />}
                  </button>
                  <button
                    disabled={!user}
                    onClick={() => handleCreateVersion()}
                    className="text-gray-500 hover:text-gray-400 ml-4"
                  >
                    {<FaRegSave />}
                  </button>
                </div>
              )}

              <FlagComponent
                flag={edits[currentIndex].flag}
                editId={edits[currentIndex].id}
              />
              <FavComponent editId={edits[currentIndex].id} />

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
          <div
            className="mt-4"
            onDoubleClick={() => user && setRichtextEdit(true)}
          >
            <RichEditor
              editable={!richtextEdit}
              content={content}
              setContent={setContent}
            />
            ;
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
        <button onClick={handleLoadComments}>Load Comments</button>
      </div>

      <div className="show all comments  px-10 py-4 max-h-[500px] overflow-y-auto">
        {fetchComments && (
          <CommentWrapper
            comments={data.comments}
            userId={edits[currentIndex].user.id}
            editId={edits[currentIndex].id}
            handleRefetchComments={handleRefetchComments}
          />
        )}
      </div>

      {showModal && (
        <ReplyModal gist_id={versionData.gistId} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default Edit;
