import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <ApolloProvider client={client}>
   
        <App />

  </ApolloProvider>,
  </React.StrictMode>
);


reportWebVitals();
