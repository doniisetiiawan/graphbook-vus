import React from 'react';
import PostHeader from './header';
import PostContent from './content';

export default function Post(props) {
  const { post } = props;

  return (
    <div className={`post ${post.id < 0 ? 'optimistic' : ''}`}>
      <PostHeader post={post} />
      <PostContent post={post} />
    </div>
  );
}
