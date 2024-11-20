import React, { useState } from "react";
import { RiFunctionAddLine, RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { CgDisplayGrid } from "react-icons/cg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ModalActionButtons = () => {
  const [modalAction, setModalAction] = useState<
    "none" | "add" | "update" | "delete" | "show"
  >("none");

  const actions = [
    {
      action: "add",
      icon: <RiFunctionAddLine size={25} />,
      tooltip: "Add sub-subject",
    },
    { action: "update", icon: <BiEdit size={25} />, tooltip: "Update subject" },
    {
      action: "delete",
      icon: <RiDeleteBin6Line size={25} />,
      tooltip: "Delete subject",
    },
    {
      action: "show",
      icon: <CgDisplayGrid size={25} />,
      tooltip: "Show details",
    },
  ];

  return (
    <div className="flex flex-row w-40 text-[25px] space-x-6 pt-6">
      {actions.map(({ action, icon, tooltip }) => {
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
              onClick={() => setModalAction(action as any)}
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
  );
};

export default ModalActionButtons;
