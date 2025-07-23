import { Context } from '../utils/context';
import { generateToken, comparePassword } from '../utils/auth';

export const authResolvers = {
  Mutation: {
    login: async (_: any, { username, password }: { username: string; password: string }, context: Context) => {
      const user = await context.prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        throw new Error('Invalid username or password');
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new Error('Invalid username or password');
      }

      const token = generateToken({
        userId: user.id,
        username: user.username
      });

      return {
        token,
        user
      };
    }
  }
};
