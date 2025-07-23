import { authResolvers } from './auth';
import { userResolvers } from './user';
import { threadResolvers } from './thread';
import { messageResolvers } from './message';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...threadResolvers.Query,
    ...messageResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...threadResolvers.Mutation,
    ...messageResolvers.Mutation
  },
  Subscription: {
    ...messageResolvers.Subscription
  },
  Thread: {
    ...threadResolvers.Thread
  },
  Message: {
    ...messageResolvers.Message
  },
  User: {
    ...userResolvers.User
  }
};
