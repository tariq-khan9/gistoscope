import { useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

const FavComponent = () => {
  const [favorite, setFavorite] = useState(false);
  return favorite ? <MdFavorite /> : <MdFavoriteBorder />;
};

export default FavComponent;
