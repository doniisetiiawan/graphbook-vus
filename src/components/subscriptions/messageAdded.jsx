import React from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const MESSAGES_SUBSCRIPTION = gql`
    subscription onMessageAdded {
        messageAdded {
            id
            text
            chat {
                id
            }
            user {
                id
                __typename
            }
            __typename
        }
    }
`;

export default function MessageAddedSubscription(props) {
  const { children } = props;
  return (
    <Subscription subscription={MESSAGES_SUBSCRIPTION}>
      {({ data }) => React.Children.map(
        children, child => React.cloneElement(child, { data }),
      )}
    </Subscription>
  );
}
