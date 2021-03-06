import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const GET_CURRENT_USER = gql`
    query currentUser {
        currentUser {
            id
            username
            avatar
        }
    }
`;

const UPLOAD_AVATAR = gql`
    mutation uploadAvatar($file: Upload!) {
        uploadAvatar(file : $file) {
            filename
            url
        }
    }
`;

export default function UploadAvatarMutation(props) {
  const { children } = props;
  return (
    <Mutation
      update={(store, { data: { uploadAvatar } }) => {
        const query = {
          query: GET_CURRENT_USER,
        };
        const data = store.readQuery(query);
        data.currentUser.avatar = uploadAvatar.url;
        store.writeQuery({ ...query, data });
      }}
      mutation={UPLOAD_AVATAR}
    >
      {uploadAvatar => React.Children.map(
        children, child => React.cloneElement(
          child, { uploadAvatar },
        ),
      )}
    </Mutation>
  );
}
