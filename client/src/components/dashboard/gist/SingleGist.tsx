import React from 'react';
import { useQuery, gql } from '@apollo/client';
import parse from "html-react-parser";

// Correcting the query structure
const GET_GIST = gql`
  query GetGist($id: Int!) {
    gist(id: $id) {
      title
      id
      versions {
        point
        gistId
        id
        edits {
          body
          versionId
        }
      }
    }
  }
`;

const SingleGist = () => {
  // Call useQuery and pass variables to provide the gist ID
  const { data, loading, error } = useQuery(GET_GIST, {
    variables: { id: 14 }, // Pass the ID as a variable
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
 
  
  return (
    <div className='p-12 flex flex-col space-y-5'>
      <h1>{data?.gist.title}</h1>
      {data?.gist.versions.map((version: any) => (
        <div key={version.id}>
          <h3>Version {version.point}</h3>
          {version.edits.map((edit: any) => (
            <p key={edit.versionId}>{edit.body}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SingleGist;
