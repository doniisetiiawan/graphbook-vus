import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';

export class UserConsumer extends Component {
  render() {
    const { children } = this.props;
    return (
      <ApolloConsumer>
        {(client) => {
          const user = {
            username: 'Test User',
            avatar: '/uploads/avatar1.png',
          };
          return React.Children.map(
            children, child => React.cloneElement(child, { user }),
          );
        }}
      </ApolloConsumer>
    );
  }
}
