import React from 'react';

export default function UserBar(props) {
  const { user } = props;
  if (!user) return null;
  return (
    <div className="user">
      <img src={user.avatar} alt="avatar" />
      <span>{user.username}</span>
    </div>
  );
}
