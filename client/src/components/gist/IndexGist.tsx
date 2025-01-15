import React from "react";
import { useQuery } from "@apollo/client";
import { GET_GISTS_BY_SUBJECT } from "../../services/graphql/queriesMutations";
import Gist from "./Gist";
import { groupGistsByParent } from "../../services/utils/groupGistsByParent";

import { useParams } from "react-router-dom";

const IndexGist = () => {
  const { id, title: subjectTitle } = useParams<{
    title?: string;
    id?: string;
  }>();

  // const location = useLocation();
  const query = GET_GISTS_BY_SUBJECT;
  const variables = { subjectId: Number(id) };

  const { data, loading, error } = useQuery(query, { variables });

  if (loading)
    return (
      <div className="flex h-screen w-full justify-center align-middle items-center">
        <h1 className="text-[25px]">Loading...</h1>;
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen w-full justify-center align-middle items-center">
        <h1>Something went wrong</h1>;
      </div>
    );

  const gists = data?.gists || data?.gistsBySubject || [];

  if (gists.length === 0) return <h1 className="mt-20">No Gist to display</h1>;

  const groupedGistData = groupGistsByParent(gists);
  console.log("gistt in index ", groupedGistData);

  return (
    <div className="flex w-[70%]  flex-col space-y-12 mx-4  xs:mx-8  ">
      <div className="flex w-full justify-center">
        <h1 className="pt-10 text-[30px]">{subjectTitle}</h1>
      </div>

      {groupedGistData.length > 0 && <Gist gists={groupedGistData} />}
    </div>
  );
};

export default IndexGist;
