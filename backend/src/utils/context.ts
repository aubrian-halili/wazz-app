import { PrismaClient } from '@prisma/client';
import { verifyToken, extractTokenFromHeaders } from './auth';
import { prisma } from './database';

type User = {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Context {
  prisma: PrismaClient;
  user?: User;
}

export const createContext = async ({ req }: { req: any }): Promise<Context> => {
  const token = extractTokenFromHeaders(req.headers.authorization);

  let user: User | undefined;

  if (token) {
    try {
      const payload = verifyToken(token);
      user = await prisma.user.findUnique({
        where: { id: payload.userId }
      }) || undefined;
    } catch (error) {
      // Invalid token, user remains undefined
    }
  }

  return {
    prisma,
    user
  };
};
