import React from "react";
import { useQuery } from "@apollo/client";
import {
  GET_GISTS_BY_SUBJECT,
  GET_GISTS_BY_USER,
} from "../../services/graphql/queriesMutations";
import Gist from "./Gist";
import { groupGistsByParent } from "../../services/utils/groupGistsByParent";

import { useParams } from "react-router-dom";

const IndexGist = () => {
  const {
    id,
    title: subjectTitle,
    type,
  } = useParams<{
    type?: string;
    title?: string;
    id?: string;
  }>();

  // const location = useLocation();
  const query = type === "subject" ? GET_GISTS_BY_SUBJECT : GET_GISTS_BY_USER;
  const variables =
    type === "subject" ? { subjectId: Number(id) } : { userId: Number(id) };

  const { data, loading, error } = useQuery(query, { variables });
  console.log("data in index by ", data, type, id, subjectTitle);
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

  const gists = data?.gistsByUser || data?.gistsBySubject || [];

  if (gists.length === 0) return <h1 className="mt-20">No Gist to display</h1>;

  const groupedGistData =
    type === "subject" ? groupGistsByParent(gists) : gists;
  console.log("gist by user ", groupedGistData);

  return (
    <div className="flex w-[90%] sm:w-[85%] lg:w-[70%]  flex-col space-y-4 sm:space-y-6 mx-4  xs:mx-8  ">
      <div className="flex w-full justify-center">
        <h1 className="pt-12 font-montserrat  text-gray-600 text-[18px] sm:text-[28px]">
          {subjectTitle}
          <span className="text-gray-400 ">'s gists</span>
        </h1>
      </div>

      {groupedGistData.length > 0 && <Gist gists={groupedGistData} />}
    </div>
  );
};

export default IndexGist;
