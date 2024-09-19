import {ApolloServer} from '@apollo/server'
import {startStandaloneServer} from '@apollo/server/standalone'
import { typeDefs } from './schema/typeDefs/index.js'
import { resolvers } from './schema/resolvers/index.js'


const server = new ApolloServer({
  typeDefs,
  resolvers
})

const {url } = await startStandaloneServer(server, {
    listen: {port: 4000}
})

console.log("Apollo server running on port 4000", url)