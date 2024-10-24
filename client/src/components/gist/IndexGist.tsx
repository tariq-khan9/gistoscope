import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_GISTS } from "../../services/graphql/queriesMutations";
import Gist from "./Gist";
import { groupGistsByParent } from "../../services/utils/groupGistsByParent";
import { sortGistsByTime } from "../../services/utils/sortGistsByTime";

const IndexGist = () => {
  const { data, loading, error } = useQuery(GET_ALL_GISTS);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong</h1>;

  const groupedGistData = groupGistsByParent(data.gists);

  return (
    <div className="flex flex-col space-y-12 mx-4 overflow-y-auto px-28">
      {groupedGistData.length > 0 && <Gist gists={groupedGistData} />}
    </div>
  );
};

export default IndexGist;
