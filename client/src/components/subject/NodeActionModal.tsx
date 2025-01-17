import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { RiFunctionAddLine, RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { CgDisplayGrid } from "react-icons/cg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useGlobalContext } from "../context/AuthContext";
import {
  CREATE_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  GET_ALL_SUBJECTS,
} from "../../services/graphql/queriesMutations";
import { useMutation } from "@apollo/client";
import CreateGistModal from "./CreateGistModal";

interface Subject {
  id: number;
  title: string;
  parentId: number | null;
}

interface NodeActionModalProps {
  visible: boolean;
  position: { x: number; y: number };
  node: Subject | null;
  onClose: () => void;
  setModalAction: (action: string) => void;
  modalAction: string;
}

const NodeActionModal: React.FC<NodeActionModalProps> = ({
  visible,
  position,
  node,
  onClose,
  setModalAction,
  modalAction,
}) => {
  const [createNewSubject] = useMutation(CREATE_SUBJECT, {
    refetchQueries: [{ query: GET_ALL_SUBJECTS }],
  });
  const [updateSubject] = useMutation(UPDATE_SUBJECT, {
    refetchQueries: [{ query: GET_ALL_SUBJECTS }],
  });
  const [deleteSubject] = useMutation(DELETE_SUBJECT, {
    refetchQueries: [{ query: GET_ALL_SUBJECTS }],
  });

  const { user } = useGlobalContext();

  const [subjectTitle, setSubjectTitle] = useState(node?.title);
  const [createGistModalVisible, setCreateGistModalVisible] = useState(false);

  const handleAddSubject = async () => {
    if (subjectTitle === node?.title) {
      setSubjectTitle("");
      return;
    }
    if (!subjectTitle) return;
    try {
      await createNewSubject({
        variables: {
          subject: {
            title: subjectTitle,
            parentId: node?.id,
            userId: 1,
            createdAt: new Date().toISOString(),
          },
        },
      });
      onClose();
    } catch (e) {}
  };

  const handleUpdateSubject = async () => {
    if (subjectTitle === node?.title) return;
    if (!subjectTitle) return;
    try {
      await updateSubject({
        variables: {
          id: node?.id,
          subject: {
            title: subjectTitle,
          },
        },
      });
      onClose();
    } catch (e) {
      console.log("error in ", e);
    }
  };

  const handleDeleteSubject = async () => {
    Modal.confirm({
      title: "Confirm Deletion",
      content:
        "Are you sure you want to delete this subject? This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteSubject({
            variables: {
              id: node?.id,
            },
          });
          onClose();
        } catch (e) {
          console.error("Error deleting subject:", e);
        }
      },
      onCancel: () => {
        console.log("Deletion cancelled");
      },
    });
  };

  const handleShowDetails = () => {
    setCreateGistModalVisible(true);
  };

  const actionsArray = [
    {
      action: "add",
      icon: <RiFunctionAddLine size={25} />,
      tooltip: "Add sub-subject",
      handler: handleAddSubject,
      roles: ["admin"],
    },
    {
      action: "update",
      icon: <BiEdit size={25} />,
      tooltip: "Update subject",
      handler: handleUpdateSubject,
      roles: ["admin"],
    },
    {
      action: "delete",
      icon: <RiDeleteBin6Line size={25} />,
      tooltip: "Delete subject",
      handler: handleDeleteSubject,
      roles: ["admin"],
    },
    {
      action: "show",
      icon: <CgDisplayGrid size={25} />,
      tooltip: "Create Gist",
      handler: handleShowDetails,
      roles: ["admin", "member"],
    },
  ];

  useEffect(() => {
    setSubjectTitle(node?.title || "");
  }, [node]);

  if (!user) return <div></div>;

  // If user is a member, directly open the CreateGistModal
  if (user.userType === "member") {
    return (
      <CreateGistModal
        visible={visible} // Use the `visible` prop to control visibility
        onClose={onClose} // Use the `onClose` prop to close the modal
        subjectId={node?.id}
      />
    );
  }

  const filteredActions = actionsArray.filter((action) =>
    action.roles.includes(user.userType)
  );

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{
        top: position.y,
        left: position.x,
        position: "absolute",
      }}
      width={300}
      mask={false}
      destroyOnClose
    >
      <CreateGistModal
        visible={createGistModalVisible}
        onClose={() => setCreateGistModalVisible(false)}
        subjectId={node?.id}
      />

      <input
        type="text"
        disabled={
          modalAction === "none" ||
          modalAction === "delete" ||
          modalAction === "show"
        }
        value={subjectTitle}
        onChange={(e) => setSubjectTitle(e.target.value)}
        className={` ${
          modalAction === "none" ||
          modalAction === "delete" ||
          modalAction === "show"
            ? "bg-white"
            : "bg-white border p-2 rounded"
        }`}
      />

      <div className="flex flex-row w-40 text-[15px] space-x-6 pt-6">
        {filteredActions.map(({ action, icon, tooltip, handler }) => {
          const isDisabled = modalAction !== "none" && modalAction !== action;

          return (
            <div
              key={action}
              className={`${
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
              {...(!isDisabled && {
                "data-tooltip-id": "tooltip",
                "data-tooltip-content": tooltip,
              })}
            >
              <button
                onClick={() => {
                  setModalAction(action as any);
                  if (!isDisabled) handler();
                }}
                disabled={isDisabled}
                className="focus:outline-none"
              >
                {icon}
              </button>
            </div>
          );
        })}

        <ReactTooltip id="tooltip" />
      </div>
    </Modal>
  );
};

export default NodeActionModal;
