import { Query } from './query.js';
import { Mutation } from './mutation.js';
import { fieldResolvers } from './fieldResolvers.js';

export const resolvers = {
  Query,
  Mutation,
  ...fieldResolvers,  // Spread the field resolvers into the main resolvers object
};
