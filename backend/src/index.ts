import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';

import { typeDefs } from './types/schema';
import { resolvers } from './resolvers';
import { createContext } from './utils/context';
import { connectDatabase } from './utils/database';

dotenv.config();

async function startServer() {
  // Connect to database
  await connectDatabase();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const PORT = process.env.PORT || 4000;

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(PORT) },
    context: async ({ req }) => createContext({ req })
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer().catch(error => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
