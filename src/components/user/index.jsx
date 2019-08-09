import React from 'react';
import PostsQuery from '../queries/postsFeed';
import FeedList from '../post/feedlist';
import UserHeader from './header';
import UserQuery from '../queries/userQuery';

export default function UserProfile(props) {
  const { username } = props;
  const queryVariables = {
    page: 0,
    limit: 10,
    username,
  };
  return (
    <div className="user">
      <div className="inner">
        <UserQuery variables={{ username }}>
          <UserHeader />
        </UserQuery>
      </div>
      <div className="container">
        <PostsQuery variables={queryVariables}>
          <FeedList />
        </PostsQuery>
      </div>
    </div>
  );
}
