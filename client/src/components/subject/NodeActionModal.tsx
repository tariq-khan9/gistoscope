import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { RiFunctionAddLine, RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { CgDisplayGrid } from "react-icons/cg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  CREATE_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  GET_ALL_SUBJECTS,
} from "../../services/graphql/queriesMutations";
import { useQuery, useMutation } from "@apollo/client";
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

  const [subjectTitle, setSubjectTitle] = useState(node?.title);
  const [createGistModalVisible, setCreateGistModalVisible] = useState(false);

  const handleAddSubject = async () => {
    if (subjectTitle === node?.title) {
      setSubjectTitle("");
      return;
    }
    if (!subjectTitle) return;
    try {
      const response = await createNewSubject({
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
      //alert(response);
    } catch (e) {}
  };

  const handleUpdateSubject = async () => {
    if (subjectTitle === node?.title) return;
    if (!subjectTitle) return;
    try {
      const response = await updateSubject({
        variables: {
          id: node?.id,
          subject: {
            title: subjectTitle,
          },
        },
      });
      onClose();
      //alert(response);
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
          const response = await deleteSubject({
            variables: {
              id: node?.id,
            },
          });
          onClose(); // Close modal after deletion
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
    console.log("Show details triggered");
    setCreateGistModalVisible(true);
  };

  const actionsArray = [
    {
      action: "add",
      icon: <RiFunctionAddLine size={25} />,
      tooltip: "Add sub-subject",
      handler: handleAddSubject,
    },
    {
      action: "update",
      icon: <BiEdit size={25} />,
      tooltip: "Update subject",
      handler: handleUpdateSubject,
    },
    {
      action: "delete",
      icon: <RiDeleteBin6Line size={25} />,
      tooltip: "Delete subject",
      handler: handleDeleteSubject,
    },
    {
      action: "show",
      icon: <CgDisplayGrid size={25} />,
      tooltip: "Show details",
      handler: handleShowDetails,
    },
  ];

  useEffect(() => {
    setSubjectTitle(node?.title || "");
  }, [node]);

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
      />

      <input
        type="text"
        disabled={
          modalAction === "none" ||
          modalAction === "delete" ||
          modalAction === "show"
        } // Disable based on modalAction
        value={subjectTitle}
        onChange={(e) => setSubjectTitle(e.target.value)} // Update subjectTitle when editable
        className={` ${
          modalAction === "none" ||
          modalAction === "delete" ||
          modalAction === "show"
            ? "bg-white"
            : "bg-white border p-2 rounded"
        }`}
      />

      {/*-------------------- action buttons and tooltips ------------------------------*/}
      <div className="flex flex-row w-40 text-[15px] space-x-6 pt-6">
        {actionsArray.map(({ action, icon, tooltip, handler }) => {
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
                  if (!isDisabled) handler(); // Call the corresponding handler
                }}
                disabled={isDisabled}
                className="focus:outline-none"
              >
                {icon}
              </button>
            </div>
          );
        })}

        {/* Tooltip Component */}
        <ReactTooltip id="tooltip" />
      </div>
    </Modal>
  );
};

export default NodeActionModal;
