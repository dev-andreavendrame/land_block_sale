import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Graphql Client
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

export const subsquidClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://squid.subsquid.io/skybreach-landsale-analytics/v/v17/graphql",
})

// Test query
subsquidClient
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
  <ApolloProvider client={subsquidClient}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
