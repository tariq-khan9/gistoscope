import { FaFlag, FaRegFlag } from "react-icons/fa";
import { UPDATE_EDIT } from "../../services/graphql/queriesMutations";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface FlagComponentProps {
  flag: boolean;
  editId: number;
}

const FlagComponent = ({ flag, editId }: FlagComponentProps) => {
  const [isFlagged, setIsFlagged] = useState(flag); // Local state to track flag visually

  const [updateEdit] = useMutation(UPDATE_EDIT, {
    onCompleted: (data) => {
      // Update the local state only after a successful mutation
      setIsFlagged(data.updateEdit.flag);
    },
    onError: (error) => {
      console.error("Error updating flag:", error);
      // Optionally handle errors, e.g., by showing a message to the user
    },
  });

  const { user } = useAuth();

  useEffect(() => {
    setIsFlagged(flag);
  }, [editId]);

  const handleClick = async () => {
    if (!user) return;
    try {
      // Call mutation with the opposite flag value
      const res = await updateEdit({
        variables: {
          id: editId,
          edit: {
            flag: !isFlagged, // Flip the current flag state for the mutation
          },
        },
      });
      console.log(editId, res);
    } catch (error) {
      console.error("Failed to update flag in database:", error);
    }
  };

  return isFlagged ? (
    <FaFlag
      onClick={handleClick}
      size={16}
      className="text-red-400 cursor-pointer"
    />
  ) : (
    <FaRegFlag onClick={handleClick} size={16} className="cursor-pointer" />
  );
};

export default FlagComponent;
