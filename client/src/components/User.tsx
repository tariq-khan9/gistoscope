import React from 'react'
import { useQuery, gql } from '@apollo/client';

const GET_LOCATIONS = gql`
 query users{
  users {
    id
    name
    username
    password
    image
  }
}
`;

const User = () => {

    const { loading, error, data } = useQuery(GET_LOCATIONS);

    if(loading) return <h1>loading...</h1>

    console.log(data)
  return (
    <div>
      user
    </div>
  )
}

export default User
