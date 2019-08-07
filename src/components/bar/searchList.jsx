import React, { Component } from 'react';

export default class SearchList extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    showList: this.checkLength(this.props.users),
  };

  componentWillReceiveProps(props) {
    this.showList(props.users);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeList);
  }

  closeList = () => {
    this.setState({ showList: false });
  };

  showList(users) {
    if (this.checkLength(users)) {
      this.setState({ showList: true });
    } else {
      this.closeList();
    }
  }

  checkLength(users) {
    if (users.length > 0) {
      document.addEventListener('click', this.closeList);
      return true;
    }
    return false;
  }

  render() {
    const { users } = this.props;
    const { showList } = this.state;
    return (
      showList
      && (
      <div className="result">
        {users.map(user => (
          <div key={user.id} className="user">
            <img src={user.avatar} alt="avatar" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
      )
    );
  }
}
