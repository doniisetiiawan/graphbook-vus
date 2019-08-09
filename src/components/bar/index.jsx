import React from 'react';
import SearchBar from './search';
import UserBar from './user';
import { UserConsumer } from '../context/user';
import Logout from './logout';
import Home from './home';

export default function Bar(props) {
  const { changeLoginState } = props;
  return (
    <div className="topbar">
      <div className="inner">
        <SearchBar />
        <UserConsumer>
          <UserBar />
        </UserConsumer>
      </div>
      <div className="buttons">
        <Home />
        <Logout changeLoginState={changeLoginState} />
      </div>
    </div>
  );
}
