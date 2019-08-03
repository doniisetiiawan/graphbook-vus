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

const GET_CHAT = gql`
    query chat($chatId: Int!) {
        chat(chatId: $chatId) {
            id
            users {
                id
                avatar
                username
            }
            messages {
                id
                text
                user {
                    id
                }
            }
        }
    }
`;

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

  state = {
    openChats: [],
  };

  openChat = (id) => {
    const { openChats: openChats1 } = this.state;
    let openChats = openChats1.slice();

    if (openChats.indexOf(id) === -1) {
      if (openChats.length > 2) {
        openChats = openChats.slice(1);
      }
      openChats.push(id);
    }

    this.setState({ openChats });
  };

  render() {
    const self = this;
    const { openChats } = this.state;

    return (
      <div className="wrapper">
        <div className="chats">
          <Query query={GET_CHATS}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return error.message;

              const { chats } = data;

              return chats.map(chat => (
                <div
                  key={`chat${chat.id}`}
                  className="chat"
                  onClick={() => self.openChat(chat.id)}
                >
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

        <div className="openChats">
          {openChats.map(chatId => (
            <Query
              key={`chatWindow${chatId}`}
              query={GET_CHAT}
              variables={{ chatId }}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return error.message;

                const { chat } = data;

                return (
                  <div className="chatWindow">
                    <div className="header">
                      <span>{chat.users[1].username}</span>
                      <button type="button" className="close">X</button>
                    </div>
                    <div className="messages">
                      {chat.messages.map(message => (
                        <div
                          key={`message${message.id}`}
                          className={`message ${message.user.id > 1
                            ? 'left' : 'right'}`}
                        >
                          {message.text}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </Query>
          ))}
        </div>
      </div>
    );
  }
}

export default Chats;
