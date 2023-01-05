import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Graphql Client
import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert('Graphql error ${message} ');
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "https://squid.subsquid.io/skybreach-landsale-analytics/v/v16/graphql" }),
]);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://squid.subsquid.io/skybreach-landsale-analytics/v/v16/graphql",
})

// Test query
client
  .query({
    query: gql`
    query MyQuery {
      plotById(id: "36413") {
        id
        data {
          rarity
        }
      }
    }
    `,
  })
  .then((result) => {
    console.log("Query test result:");
    const data = result['data']['plotById']['data']['rarity'];
    console.log("Land plot rarity: %d", data);
  }
  );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
