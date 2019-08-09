import React from 'react';

export default function UserProfileHeader(props) {
  const { user } = props;
  const { avatar, email, username } = user;
  return (
    <div className="profileHeader">
      <div className="avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <div className="information">
        <p>
          {username}
        </p>
        <p>
          {email}
        </p>
        <p>You can provide further information here and build
          your really personal header component for your users.
        </p>
      </div>
    </div>
  );
}
