// Graphql Client
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

export const subsquidChunkiesClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://squid.subsquid.io/skybreach-chunky-gifts/v/v0/graphql",
});

const squidChunkyEndpoint = new HttpLink({
    uri: 'https://squid.subsquid.io/skybreach-chunky-gifts/v/v0/graphql',
});

//pass them to apollo-client config
export const generalSubsquidClient = new ApolloClient({
    link: ApolloLink.split(
        operation => operation.getContext().clientName === 'chunkySquid',
        squidChunkyEndpoint,
        null
    )
});