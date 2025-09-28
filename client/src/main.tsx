import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App.tsx';
import './index.css';
import { store } from './store.ts';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './graphql/apolloClient.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </ApolloProvider>
);
