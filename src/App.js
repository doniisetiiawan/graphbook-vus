/* eslint-disable react/jsx-filename-extension,global-require */
import React, { Component } from 'react';
import './App.css';

const posts = [{
  id: 2,
  text: 'Lorem ipsum',
  user: {
    avatar: require('./uploads/avatar1.png'),
    username: 'Test User',
  },
},
{
  id: 1,
  text: 'Lorem ipsum',
  user: {
    avatar: require('./uploads/avatar2.png'),
    username: 'Test User 2',
  },
}];

class App extends Component {
  state = {
    posts,
  };

  render() {
    const { posts } = this.state;

    return (
      <div className="container">
        <div className="feed">
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="header">
                <img src={post.user.avatar} alt="avatar" />
                <h2>{post.user.username}</h2>
              </div>
              <p className="content">
                {post.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
