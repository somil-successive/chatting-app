import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

import { createClient } from 'graphql-ws';

const httpLink = createHttpLink({
  uri: "http://localhost:5500/graphql",
});

// const wsLink = new WebSocketLink({
//   uri: "ws://localhost:5500/graphql",
//   options: {
//     reconnect: true,
//   },
// });


const wsLink = new GraphQLWsLink(createClient({

  url: 'ws://localhost:5500/graphql',

}));

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// const client = new ApolloClient({
//   wsLink,
//   uri: "http://localhost:5500/graphql",
//   cache: new InMemoryCache(),

// });

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

reportWebVitals();
