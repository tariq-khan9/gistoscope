
import React from 'react'
import { gql, useQuery } from '@apollo/client';
import Gist from './Gist'
import { groupGistsByParent } from '../../services/utils/groupGistsByParent';



const GET_GISTS = gql`
   query GetGists {
    gists {
      id
      title
      parentId
      createdAt
      versions {
        id
        point
        edits {
          id
          body
        }
      }
    }
  }
`;


const IndexGist = () => {

  const {data, loading, error} =  useQuery(GET_GISTS)

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong</h1>;

 const groupedGistData = groupGistsByParent(data.gists) 

  return (
    <div className='flex flex-col space-y-12 m-4 overflow-y-auto p-8 px-28'>
       {groupedGistData.length>0 && <Gist gists={groupedGistData}/>}  
    </div>
  )
}

export default IndexGist
