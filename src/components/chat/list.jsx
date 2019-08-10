/* eslint-disable block-scoped-var,no-underscore-dangle */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

const MESSAGES_SUBSCRIPTION = gql`
    subscription onMessageAdded {
        messageAdded {
            id
            text
            chat {
                id
            }
            user {
                id
                __typename
            }
            __typename
        }
    }
`;

class ChatsList extends Component {
  componentDidMount() {
    this.subscribeToNewMessages();
  }

  subscribeToNewMessages = () => {
    const self = this;
    const { subscribeToMore } = this.props;
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        let i;
        if (!subscriptionData.data || !prev.chats.length) return prev;

        let index = -1;
        for (i = 0; i < prev.chats.length; i += 1) {
          if (prev.chats[i].id === subscriptionData.data.messageAdded.chat.id) {
            index = i;
            break;
          }
        }

        if (index === -1) return prev;

        const newValue = Object.assign({}, prev.chats[i], {
          lastMessage: {
            text: subscriptionData.data.messageAdded.text,
            __typename: subscriptionData.data.messageAdded.__typename,
          },
        });
        const newList = { chats: [...prev.chats] };
        newList.chats[i] = newValue;

        try {
          const data = self.props.client.store.cache.readQuery({
            query:
            GET_CHAT,
            variables: {
              chatId:
              subscriptionData.data.messageAdded.chat.id,
            },
          });
          if (user.id !== subscriptionData.data.messageAdded.user.id) {
            data.chat.messages.push(subscriptionData.data.messageAdded);
            self.props.client.store.cache.writeQuery({
              query: GET_CHAT,
              variables: { chatId: subscriptionData.data.messageAdded.chat.id },
              data,
            });
          }
        } catch (e) {}

        return newList;
      },
    });
  };

  usernamesToString = (userList) => {
    const { user } = this.props;
    let usernamesString = '';
    for (let i = 0; i < userList.length; i += 1) {
      if (userList[i].username !== user.username) {
        usernamesString += userList[i].username;
      }
      if (i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    return usernamesString;
  };

  getAvatar = (userList) => {
    const { user } = this.props;
    if (userList.length > 2) {
      return '/public/group.png';
    }
    if (userList[0].id !== user.id) {
      return userList[0].avatar;
    }
    return userList[1].avatar;
  };

  shorten = (text) => {
    if (!text.length) {
      return '';
    }
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }
    return text;
  };

  render() {
    const { chats } = this.props;
    const { openChat } = this.props;
    return (
      <div className="chats">
        {chats.map(chat => (
          <div
            key={`chat${chat.id}`}
            className="chat"
            onClick={() => openChat(chat.id)}
          >
            <div className="header">
              <img src={this.getAvatar(chat.users)} alt="avatar" />
              <div>
                <h2>{this.shorten(this.usernamesToString(chat.users))}</h2>
                <span>{chat.lastMessage
                && this.shorten(chat.lastMessage.text)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default withApollo(ChatsList);
