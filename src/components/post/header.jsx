import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from '../helpers/dropdown';

export default ({ post, changeState }) => (
  <div className="header">
    <img src={post.user.avatar} alt="avatar" />
    <div>
      <h2>{post.user.username}</h2>
    </div>
    <Dropdown trigger={<FontAwesomeIcon icon="angle-down" />}>
      <button type="button" onClick={changeState}>Edit</button>
    </Dropdown>
  </div>
);
