import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_CHATS = gql`{
    chats {
        id
        users {
            id
            avatar
            username
        }
        lastMessage {
            text
        }
    }
}`;

class Chats extends Component {
  static usernamesToString(users) {
    const userList = users.slice(1);
    let usernamesString = '';

    for (let i = 0; i < userList.length; i += 1) {
      usernamesString += userList[i].username;
      if (i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    return usernamesString;
  }

  static shorten(text) {
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }

    return text;
  }

  render() {
    return (
      <div className="chats">
        <Query query={GET_CHATS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return error.message;

            const { chats } = data;

            return chats.map(chat => (
              <div key={`chat${chat.id}`} className="chat">
                <div className="header">
                  <img
                    src={(chat.users.length > 2 ? '/public/group.png'
                      : chat.users[1].avatar)}
                    alt="avatar"
                  />
                  <div>
                    <h2>{Chats.shorten(
                      Chats.usernamesToString(chat.users),
                    )}
                    </h2>
                    <span>{chat.lastMessage
                    && Chats.shorten(chat.lastMessage.text)}
                    </span>
                  </div>
                </div>
              </div>
            ));
          }}
        </Query>
      </div>
    );
  }
}

export default Chats;
