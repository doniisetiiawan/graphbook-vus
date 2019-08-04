import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const GET_POSTS = gql`
    query postsFeed($page: Int, $limit: Int) {
        postsFeed(page: $page, limit: $limit) {
            posts {
                id
                text
                user {
                    avatar
                    username
                }
            }
        }
    }
`;

const DELETE_POST = gql`
    mutation deletePost($postId : Int!) {
        deletePost(postId : $postId) {
            success
        }
    }
`;

export default function DeletePostMutation(props) {
  const { children } = props;
  const { post } = props;
  const postId = post.id;
  const variables = { page: 0, limit: 10 };

  return (
    <Mutation
      update={(store, { data: { deletePost: { success } } }) => {
        if (success) {
          let i;
          const query = {
            query: GET_POSTS,
          };
          if (typeof variables !== typeof undefined) {
            query.variables = variables;
          }
          const data = store.readQuery(query);
          for (i = 0; i < data.postsFeed.posts.length; i += 1) {
            if (data.postsFeed.posts[i].id === postId) {
              break;
            }
          }
          data.postsFeed.posts.splice(i, 1);
          store.writeQuery({ ...query, data });
        }
      }}
      mutation={DELETE_POST}
    >
      {deletePost => React.Children.map(
        children, child => React.cloneElement(
          child, { deletePost, postId },
        ),
      )}
    </Mutation>
  );
}
