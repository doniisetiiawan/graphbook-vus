/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import './App.css';

const GET_POSTS = gql`{
    posts {
        id
        text
        user {
            avatar
            username
        }
    }
}`;

const ADD_POST = gql`
    mutation addPost($post : PostInput!) {
        addPost(post : $post) {
            id
            text
            user {
                username
                avatar
            }
        }
    }`;

class Feed extends Component {
  state = {
    postContent: '',
  };

  handlePostContentChange = (event) => {
    this.setState({ postContent: event.target.value });
  };

  render() {
    const self = this;
    const { postContent } = this.state;

    return (
      <Query query={GET_POSTS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return error.message;

          const { posts } = data;

          return (
            <div className="container">
              <div className="postForm">
                <Mutation
                  mutation={ADD_POST}
                  update={(store, { data: { addPost } }) => {
                    const data = store.readQuery({ query: GET_POSTS });
                    data.posts.unshift(addPost);
                    store.writeQuery({ query: GET_POSTS, data });
                  }}
                  optimisticResponse={{
                    __typename: 'mutation',
                    addPost: {
                      __typename: 'Post',
                      text: postContent,
                      id: -1,
                      user: {
                        __typename: 'User',
                        username: 'Loading...',
                        avatar: '/public/loading.gif',
                      },
                    },
                  }}
                >
                  {addPost => (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      addPost({
                        variables: {
                          post: { text: postContent },
                        },
                      }).then(() => {
                        self.setState(() => ({
                          postContent: '',
                        }));
                      });
                    }}
                    >
                      <textarea
                        value={postContent}
                        onChange={self.handlePostContentChange}
                        placeholder="Write your custom post!"
                      />
                      <input type="submit" value="Submit" />
                    </form>
                  )}
                </Mutation>
              </div>
              <div className="feed">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className={`post ${post.id < 0 ? 'optimistic' : ''}`}
                  >
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
        }}
      </Query>
    );
  }
}

export default Feed;
