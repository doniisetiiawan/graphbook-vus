import React from 'react';
import UserProfile from './components/user';
import Chats from './Chats';
import Bar from './components/bar';
import CurrentUserQuery from './components/queries/currentUser';
import { UserConsumer } from './components/context/user';

export default function User(props) {
  const { match, changeLoginState } = props;
  return (
    <CurrentUserQuery>
      <Bar changeLoginState={changeLoginState} />
      <UserProfile username={match.params.username} />
      <UserConsumer><Chats /></UserConsumer>
    </CurrentUserQuery>
  );
}
