/* eslint-disable react/jsx-filename-extension,global-require */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
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
    postContent: '',
  };

  handlePostContentChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { postContent, posts: posts1 } = this.state;
    const newPost = {
      id: posts1.length + 1,
      text: postContent,
      user: {
        avatar: require('./uploads/avatar1.png'),
        username: 'Fake User',
      },
    };
    this.setState(prevState => ({
      posts: [newPost, ...prevState.posts],
      postContent: '',
    }));
  };

  render() {
    const { posts, postContent } = this.state;

    return (
      <div className="container">
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta name="description" content="Newsfeed of all your friends on Graphbook" />
        </Helmet>
        <div className="postForm">
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={postContent}
              onChange={this.handlePostContentChange}
              placeholder="Write your custom post!"
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
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
