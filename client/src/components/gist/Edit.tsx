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
import { useSwipeable } from "react-swipeable";
import Navigation from "../others/Navigation";

type EditProps = {
  edits: EditType[];
  versionData: VersionType;
  newVersionData: string;
  createVersion: boolean;
  setCreateVersion: (value: boolean) => void;
  versionCurrentIndex: number;
  setVersionCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  editCurrentIndex: number;
  setEditCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  gistCurrentIndex: number;
  versionsLength: number;
  gistLength: number;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const Edit: React.FC<EditProps> = ({
  edits,
  versionData,
  newVersionData,
  versionCurrentIndex,
  setVersionCurrentIndex,
  editCurrentIndex,
  setEditCurrentIndex,
  gistCurrentIndex,
  gistLength,
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

  const { textareaEdit, setTextareaEdit, user } = useGlobalContext();

  const [commentsArray, setCommentsArray] = useState<[]>();

  const {
    data,
    loading,
    refetch,
    // refetch: refetchComments,
  } = useQuery(GET_COMMENT, {
    skip: true, // Skip query execution if fetchComments is false
    variables: {
      editId: edits[editCurrentIndex]?.id || edits[0]?.id,
    },
  });

  const refetchComments = async () => {
    if (editCurrentIndex > edits.length) return;
    try {
      const result = await refetch({ editId: edits[editCurrentIndex].id });
      setCommentsArray(result.data.comments);
    } catch (error) {}
  };

  const [content, setContent] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [richtextEdit, setRichtextEdit] = useState<boolean>(false);

  const stringSizeInBytes = (str: string) => {
    const encoder = new TextEncoder();
    return encoder.encode(str).length; // Size in bytes
  };

  const handleNext = () => {
    setEditCurrentIndex((prevIndex) => (prevIndex + 1) % edits?.length);
  };

  const handlePrev = () => {
    setEditCurrentIndex((prevIndex) =>
      prevIndex === 0 ? edits.length - 1 : prevIndex - 1
    );
  };

  const handleIndexChange = (newIndex: number) => {
    setEditCurrentIndex(newIndex);
  };

  const handleCreateVersion = async () => {
    // allow content size less then 5 mb.
    const contentSize = parseFloat(
      (stringSizeInBytes(content) / (1024 * 1024)).toFixed(2)
    );
    if (contentSize > 5) {
      Modal.error({
        title: "Data too large",
        content: `Your content is ${contentSize} MBs, which must be less then 5 MBs`,
      });
      return;
    }

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
      content === edits[editCurrentIndex]?.body
    ) {
      console.log("nothing has changeed");
      setRichtextEdit(false);
      setTextareaEdit(false);
      return;
    }
    //---------if only version has changed ---------------------
    if (
      newVersionData !== versionData.point &&
      content === edits[editCurrentIndex]?.body
    ) {
      try {
        const versionResponse = await createNewVersion({
          variables: {
            version: {
              gistId: versionData.gistId,
              point: newVersionData,
              userId: user?.id,
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
                userId: user?.id,
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
      setEditCurrentIndex(0);
      setVersionCurrentIndex(0);
      refetchComments();
      return;
    }

    //---------if both have changed ---------------------

    if (
      newVersionData !== versionData.point &&
      content !== edits[editCurrentIndex]?.body
    ) {
      try {
        const versionResponse = await createNewVersion({
          variables: {
            version: {
              gistId: versionData.gistId,
              point: newVersionData,
              userId: user?.id,
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
      setEditCurrentIndex(0);
      refetchComments();
      return;
    }

    //---------if only edit has changed ---------------------

    if (
      newVersionData === versionData.point &&
      content !== edits[editCurrentIndex]?.body
    ) {
      if (richtextEdit) {
        await createEdit({
          variables: {
            edit: {
              versionId: versionData.id,
              body: content,
              userId: user?.id,
              createdAt: new Date().toISOString(),
            },
          },
        });
      }

      console.log("only edit has changeed");
      setRichtextEdit(false);
      setEditCurrentIndex(0);
      refetchComments();
      return;
    }
  };

  const handleCancelCreateVersion = () => {
    newVersionData = versionData.point;
    setContent(edits[editCurrentIndex].body);
    setRichtextEdit(false);
    setTextareaEdit(false);
  };

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true, // Enable mouse dragging
  });

  useEffect(() => {
    setContent(edits[editCurrentIndex]?.body);
  }, [edits]);

  useEffect(() => {
    setContent(edits[editCurrentIndex]?.body);
    refetchComments();
  }, [editCurrentIndex]);

  useEffect(() => {
    setEditCurrentIndex(0);
    refetchComments();
  }, [versionCurrentIndex, gistCurrentIndex, gistLength]);

  if (loading) return <h1>loading...</h1>;

  return (
    <div>
      <div
        className="w-full flex flex-col justify-between mt-10 sm:mt-0 px-2 sm:px-6 lg:px-10 py-4 rounded-lg"
        {...handleSwipe}
      >
        <div className="user-arrow-btn flex flex-col md:flex-row w-full  justify-between">
          <div className="first-row  w-full flex flex-row justify-between">
            <div className="flex flex-row space-x-1 sm:space-x-2 lg:space-x-4 items-center justify-center">
              <img
                src={edits[editCurrentIndex]?.user?.image || "/profile.png"}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                alt="imgae"
              />
              <div className="flex flex-col">
                <h1 className="text-[13px] sm:text-[14px] lg:text-[16px] text-slate-500 uppercase">
                  {" "}
                  {edits[editCurrentIndex]?.user?.name}
                </h1>

                <h2 className="text-[10px] sm:text-[12px] text-slate-600">
                  {edits[editCurrentIndex]?.createdAt &&
                    dateFormatter.format(
                      Date.parse(edits[editCurrentIndex].createdAt)
                    )}
                </h2>
              </div>
            </div>
            <div className="sm:mr-2 lg:mr-4 xl:mr-8 ">
              <div className="flex flex-row justify-between space-x-2 md:space-x-4 md:mt-1 mb-1 sm:mb-2">
                <FlagComponent
                  flag={edits[editCurrentIndex]?.flag}
                  editId={edits[editCurrentIndex]?.id}
                />
                <FavComponent editId={edits[editCurrentIndex]?.id} />
              </div>
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
            </div>
          </div>

          <div className="flex   flex-row text-[14px] mt-3 md:mt-0 justify-between md:justify-center items-center  md:space-x-6">
            <div className="flex flex-row space-x-2 sm:space-x-3">
              <CountComponent
                label="N"
                count={edits[editCurrentIndex]?.newnessCount}
                editId={edits[editCurrentIndex]?.id}
              />
              <CountComponent
                label="I"
                count={edits[editCurrentIndex]?.importantCount}
                editId={edits[editCurrentIndex]?.id}
              />
              <CountComponent
                label="Q"
                count={edits[editCurrentIndex]?.qualityCount}
                editId={edits[editCurrentIndex]?.id}
              />
            </div>
            <Navigation
              currentIndex={editCurrentIndex}
              totalItems={edits.length}
              onChangeIndex={handleIndexChange}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />

            {/* <div className="nav-buttons flex flex-row text-[14px] justify-center items-center  space-x-[4px]">
              <button
                className="arrow"
                disabled={editCurrentIndex === 0}
                onClick={handlePrev}
              >
                <IoIosArrowDropleft className="arrow" />
              </button>

              <div className="flex flex-row  font-semibold justify-center text-slate-500 ">
                {editCurrentIndex + 1}
                <h1 className="mx-1">/</h1>
                {edits?.length}
              </div>

              <button
                className="arrow"
                disabled={editCurrentIndex + 1 === edits?.length}
                onClick={handleNext}
              >
                <IoIosArrowDropright className="arrow" />
              </button>
            </div> */}
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
          </div>
        )}
      </div>

      <div className="comments and reply px-10 py-4">
        <SendComment
          setShowModal={setShowModal} // show button for reply modal
          editId={edits[editCurrentIndex]?.id}
          userId={edits[editCurrentIndex]?.user?.id}
          handleRefetchComments={refetchComments}
        />
      </div>

      <div className="show all comments  px-10 py-4 max-h-[500px] overflow-y-auto">
        {commentsArray && (
          <CommentWrapper
            comments={commentsArray}
            userId={edits[editCurrentIndex]?.user?.id}
            editId={edits[editCurrentIndex]?.id}
            handleRefetchComments={refetchComments}
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
