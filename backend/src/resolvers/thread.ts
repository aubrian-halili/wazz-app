import { Context } from '../utils/context';
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { dateFieldResolvers } from '../utils/dateFormatter';

const pubsub = new PubSub();

export const threadResolvers = {
  Query: {
    threads: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      return context.prisma.thread.findMany({
        where: {
          participants: {
            some: {
              userId: context.user.id
            }
          }
        },
        include: {
          participants: {
            include: {
              user: true
            }
          },
          messages: {
            include: {
              sender: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });
    },

    thread: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const thread = await context.prisma.thread.findFirst({
        where: {
          id: parseInt(id),
          participants: {
            some: {
              userId: context.user.id
            }
          }
        },
        include: {
          participants: {
            include: {
              user: true
            }
          },
          messages: {
            include: {
              sender: true
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      if (!thread) {
        throw new GraphQLError('Thread not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return thread;
    }
  },

  Mutation: {
    createThread: async (_: any, { participantUsername }: { participantUsername: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Find the other user
      const otherUser = await context.prisma.user.findUnique({
        where: { username: participantUsername }
      });

      if (!otherUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (otherUser.id === context.user.id) {
        throw new GraphQLError('Cannot create thread with yourself', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      // Check if thread already exists
      const existingThread = await context.prisma.thread.findFirst({
        where: {
          participants: {
            every: {
              userId: {
                in: [context.user.id, otherUser.id]
              }
            }
          }
        },
        include: {
          participants: true
        }
      });

      if (existingThread && existingThread.participants.length === 2) {
        return existingThread;
      }

      // Create new thread
      const thread = await context.prisma.thread.create({
        data: {
          participants: {
            create: [
              { userId: context.user.id },
              { userId: otherUser.id }
            ]
          }
        },
        include: {
          participants: {
            include: {
              user: true
            }
          },
          messages: {
            include: {
              sender: true
            }
          }
        }
      });

      return thread;
    }
  },

  Thread: {
    createdAt: dateFieldResolvers.createdAt,
    updatedAt: dateFieldResolvers.updatedAt,
    participants: (parent: any) => {
      return parent.participants?.map((p: any) => p.user) || [];
    }
  }
};
