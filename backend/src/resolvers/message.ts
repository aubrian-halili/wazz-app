import { Context } from '../utils/context';
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { dateFieldResolvers } from '../utils/dateFormatter';

const pubsub = new PubSub();

export const messageResolvers = {
  // Field resolvers to ensure dates are returned as ISO strings
  Message: {
    createdAt: dateFieldResolvers.createdAt
  },

  Query: {
    messages: async (_: any, { threadId }: { threadId: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Verify user is participant in this thread
      const thread = await context.prisma.thread.findFirst({
        where: {
          id: parseInt(threadId),
          participants: {
            some: {
              userId: context.user.id
            }
          }
        }
      });

      if (!thread) {
        throw new GraphQLError('Thread not found or access denied', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return context.prisma.message.findMany({
        where: {
          threadId: parseInt(threadId)
        },
        include: {
          sender: true,
          thread: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
    }
  },

  Mutation: {
    sendMessage: async (_: any, { threadId, content }: { threadId: string; content: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Verify user is participant in this thread
      const thread = await context.prisma.thread.findFirst({
        where: {
          id: parseInt(threadId),
          participants: {
            some: {
              userId: context.user.id
            }
          }
        }
      });

      if (!thread) {
        throw new GraphQLError('Thread not found or access denied', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      // Create the message
      const message = await context.prisma.message.create({
        data: {
          content,
          senderId: context.user.id,
          threadId: parseInt(threadId)
        },
        include: {
          sender: true,
          thread: {
            include: {
              participants: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      });

      // Update thread's updatedAt
      await context.prisma.thread.update({
        where: { id: parseInt(threadId) },
        data: { updatedAt: new Date() }
      });

      // Publish message for real-time updates
      pubsub.publish(`MESSAGE_ADDED_${threadId}`, { messageAdded: message });
      pubsub.publish('THREAD_UPDATED', { threadUpdated: message.thread });

      return message;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: (_: any, { threadId }: { threadId: string }) => {
        return pubsub.asyncIterableIterator(`MESSAGE_ADDED_${threadId}`);
      }
    },
    threadUpdated: {
      subscribe: () => {
        return pubsub.asyncIterableIterator('THREAD_UPDATED');
      }
    }
  }
};
