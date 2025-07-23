import { Context } from '../utils/context';
import { GraphQLError } from 'graphql';
import { dateFieldResolvers } from '../utils/dateFormatter';

export const userResolvers = {
  // Field resolvers to ensure dates are returned as ISO strings
  User: {
    createdAt: dateFieldResolvers.createdAt,
    updatedAt: dateFieldResolvers.updatedAt
  },

  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return context.user;
    }
  }
};
