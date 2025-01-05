import { useGlobalContext } from "../context/AuthContext";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import {
  GET_FAVORITE,
  CREATE_FAVORITE,
} from "../../services/graphql/queriesMutations";
import { useMutation, useQuery } from "@apollo/client";

interface Props {
  editId: number;
}

const FavComponent = ({ editId }: Props) => {
  const { user } = useGlobalContext();
  const userId = user?.id;

  const { data, loading, error } = useQuery(GET_FAVORITE, {
    variables: { userId, editId },
    skip: !user, // Skip the query if the user is not logged in
  });

  const [createFavorite] = useMutation(CREATE_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITE, variables: { userId, editId } }],
  });

  const favoriteId = data?.favorite?.id;

  const handleClick = async () => {
    if (!user) return;
    try {
      await createFavorite({
        variables: {
          fav: {
            userId: userId,
            editId: editId,
          },
        },
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  if (loading) {
    // Render a placeholder icon during loading
    return <MdFavoriteBorder color="gray" />;
  }

  return favoriteId ? (
    <MdFavorite color="red" onClick={handleClick} />
  ) : (
    <MdFavoriteBorder onClick={handleClick} />
  );
};

export default FavComponent;
