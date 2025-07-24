import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP Link for GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Auth Link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create Apollo Client
export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
