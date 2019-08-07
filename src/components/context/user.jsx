import React, { createContext } from 'react';

const { Provider, Consumer } = createContext();

export function UserProvider(props) {
  const { children } = props;
  const user = {
    username: 'Test User',
    avatar: '/uploads/avatar1.png',
  };
  return (
    <Provider value={user}>
      {children}
    </Provider>
  );
}

export function UserConsumer(props) {
  const { children } = props;
  return (
    <Consumer>
      {user => React.Children.map(
        children, child => React.cloneElement(child, { user }),
      )}
    </Consumer>
  );
}
