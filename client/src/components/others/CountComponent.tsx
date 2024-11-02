import React from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useMutation } from "@apollo/client";
import {
  UPDATE_EDIT,
  CREATE_ACTION,
  GET_ALL_GISTS,
} from "../../services/graphql/queriesMutations";
import { EditType } from "../../services/types";

interface CountProps {
  label: string;
  count: number;
  editId: number;
  userId: number;
}

const CountComponent = ({ label, count, editId, userId }: CountProps) => {
  const [updateEdit] = useMutation(UPDATE_EDIT, {
    refetchQueries: [{ query: GET_ALL_GISTS }],
  });

  const [createAction] = useMutation(CREATE_ACTION);

  const handleIncrement = async () => {
    if (label == "N") {
      try {
        const actionResponse = await createAction({
          variables: {
            action: {
              userId: userId,
              editId: editId,
              field: "newnessCount",
              actionType: "increment",
            },
          },
        });

        if (!actionResponse) {
          return;
        }

        await updateEdit({
          variables: {
            id: editId,
            edit: {
              newnessCount: count + 1,
            },
          },
        });
      } catch (e) {}
    }
    // if lable is important or I
    if (label == "I") {
      try {
        const actionResponse = await createAction({
          variables: {
            action: {
              userId: userId,
              editId: editId,
              field: "importantCount",
              actionType: "increment",
            },
          },
        });

        if (!actionResponse) {
          return;
        }

        await updateEdit({
          variables: {
            id: editId,
            edit: {
              importantCount: count + 1,
            },
          },
        });
      } catch (e) {}
    }
    // if lable is quality or Q
    if (label == "Q") {
      try {
        const actionResponse = await createAction({
          variables: {
            action: {
              userId: userId,
              editId: editId,
              field: "qualityCount",
              actionType: "increment",
            },
          },
        });

        if (!actionResponse) {
          return;
        }

        await updateEdit({
          variables: {
            id: editId,
            edit: {
              qualityCount: count + 1,
            },
          },
        });
      } catch (e) {}
    }
  };

  const handleDecrement = async () => {
    if (label == "N") {
      try {
        const actionResponse = await createAction({
          variables: {
            action: {
              userId: userId,
              editId: editId,
              field: "newnessCount",
              actionType: "decrement",
            },
          },
        });

        if (!actionResponse) {
          return;
        }

        await updateEdit({
          variables: {
            id: editId,
            edit: {
              newnessCount: count - 1,
            },
          },
        });
      } catch (e) {}
    }
    // if lable is important or I
    if (label == "I") {
      try {
        const actionResponse = await createAction({
          variables: {
            action: {
              userId: userId,
              editId: editId,
              field: "importantCount",
              actionType: "decrement",
            },
          },
        });

        if (!actionResponse) {
          return;
        }

        await updateEdit({
          variables: {
            id: editId,
            edit: {
              importantCount: count - 1,
            },
          },
        });
      } catch (e) {}
    }
    // if lable is quality or Q
    if (label == "Q") {
      try {
        const actionResponse = await createAction({
          variables: {
            action: {
              userId: userId,
              editId: editId,
              field: "qualityCount",
              actionType: "decrement",
            },
          },
        });

        if (!actionResponse) {
          return;
        }

        await updateEdit({
          variables: {
            id: editId,
            edit: {
              qualityCount: count - 1,
            },
          },
        });
      } catch (e) {}
    }
  };

  // const handleUpdate = async (actionType: "increment" | "decrement") => {
  //   const newCount = actionType === "increment" ? count + 1 : count - 1;

  //   try {
  //     await updateEdit({
  //       variables: {
  //         id: editId,
  //         edit: {
  //           newnessCount: label === "Newness" ? newCount : undefined,
  //           importantCount: label === "Important" ? newCount : undefined,
  //           qualityCount: label === "Quality" ? newCount : undefined,
  //           flag: undefined, // Add any other required fields here
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error updating count:", error);
  //   }
  // };
  return (
    <div className="flex flex-row border border-amber-600 rounded-md items-center px-2">
      <div className="h-6 w-6 mr-2 rounded-full  bg-sky-700 flex justify-center items-center text-white">
        {label}
      </div>
      <div className="flex flex-col items-center text-[14px] leading-none gap-0">
        <button onClick={() => handleIncrement()} className="p-0 m-0">
          <TiArrowSortedUp className="h-4 w-4 text-amber-600 hover:text-amber-400" />
        </button>
        <label className="p-0 m-0 inline-flex">{count}</label>
        <button onClick={() => handleDecrement()} className="p-0 m-0">
          <TiArrowSortedDown className="h-4 w-4 text-amber-600 hover:text-amber-400" />
        </button>
      </div>
    </div>
  );
};

export default CountComponent;
