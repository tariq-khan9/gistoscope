import { useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import {
  GET_FAVORITE,
  CREATE_FAVORITE,
} from "../../services/graphql/queriesMutations";
import { useMutation, useQuery } from "@apollo/client";

interface Props {
  editId: number;
  userId: number;
}

const FavComponent = ({ userId, editId }: Props) => {
  const { data, loading, error } = useQuery(GET_FAVORITE, {
    variables: { userId, editId },
  });

  const [createFavorite] = useMutation(CREATE_FAVORITE, {
    refetchQueries: [{ query: GET_FAVORITE, variables: { userId, editId } }],
  });
  const favoriteId = data?.favorite?.id;

  const handleClick = async () => {
    try {
      const res = await createFavorite({
        variables: {
          fav: {
            userId: userId,
            editId: editId,
          },
        },
      });
    } catch (error) {}
  };

  if (loading) return <p>Loading...</p>;

  return favoriteId ? (
    <MdFavorite color="red" />
  ) : (
    <MdFavoriteBorder onClick={handleClick} />
  );
};

export default FavComponent;
