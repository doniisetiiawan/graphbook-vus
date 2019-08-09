import React from 'react';
import Feed from './Feed';
import Chats from './Chats';
import Bar from './components/bar';
import CurrentUserQuery from './components/queries/currentUser';

export default function Main(props) {
  const { changeLoginState } = props;
  return (
    <CurrentUserQuery>
      <Bar changeLoginState={changeLoginState} />
      <Feed />
      <Chats />
    </CurrentUserQuery>
  );
}
