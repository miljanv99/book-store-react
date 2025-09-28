import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_APOLLO_CLIENT_URL
  }),
  cache: new InMemoryCache()
});
