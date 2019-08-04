import React, { Component } from 'react';

export default class ChatInput extends Component {
  state = {
    value: '',
  };

  handleKeyPress = (event) => {
    const self = this;
    const { chat, addMessage } = this.props;
    const { value } = this.state;

    if (event.key === 'Enter' && value.length) {
      addMessage(
        { variables: { message: { text: value, chatId: chat.id } } },
      ).then(() => {
        self.setState({ value: '' });
      });
    }
  };

  onChangeChatInput = (event) => {
    event.preventDefault();

    this.setState({ value: event.target.value });
  };

  render() {
    const { value } = this.state;

    return (
      <div className="input">
        <input
          type="text"
          value={value}
          onChange={this.onChangeChatInput}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }
}
