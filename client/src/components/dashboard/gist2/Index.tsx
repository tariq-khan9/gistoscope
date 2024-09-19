'use client'
import React from 'react'
import { GistType } from './../../../services/types';
import { gql, useQuery } from '@apollo/client';
import Gist from './Gist'

const GET_GISTS = gql`
  query GetGists {
    gists {
      id
      title
      versions {
        point
        user {
          name
        }
        edits {
          body
          user {
            name
          }
         
        }
      }
      
    }
  }
`;

const IndexGist = () => {

  const {data, loading, error} =  useQuery(GET_GISTS)

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong</h1>;

  console.log("this is data", data)

  const gists: GistType[] = data?.gists || [];

  return (
    <div className=' m-8 mx-20 p-8'>
        {gists.length && <Gist gists={gists}/>}
    </div>
  )
}

export default IndexGist
