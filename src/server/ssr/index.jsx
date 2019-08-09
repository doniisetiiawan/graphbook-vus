import React from 'react';
import { ApolloProvider } from 'react-apollo';
import App from './app';

export default function ServerClient(props) {
  const { client, location, context } = props;
  return (
    <ApolloProvider client={client}>
      <App location={location} context={context} />
    </ApolloProvider>
  );
}
