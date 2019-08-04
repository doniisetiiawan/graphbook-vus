import React, { Component } from 'react';

class ChatsList extends Component {
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
    if (!text.length) {
      return '';
    }
    if (text.length > 12) {
      return `${text.substring(0, text.length - 9)}...`;
    }
    return text;
  }

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
              <img
                src={(chat.users.length > 2
                  ? '/public/group.png' : chat.users[1].avatar)}
                alt="avatar"
              />
              <div>
                <h2>{ChatsList.shorten(
                  ChatsList.usernamesToString(chat.users),
                )}
                </h2>
                <span>{chat.lastMessage
                && ChatsList.shorten(chat.lastMessage.text)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ChatsList;
