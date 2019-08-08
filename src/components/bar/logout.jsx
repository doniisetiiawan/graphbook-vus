import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

class Logout extends Component {
  logout = () => {
    localStorage.removeItem('jwt');
    const { client, changeLoginState } = this.props;
    changeLoginState(false);
    client.resetStore();
  };

  render() {
    return (
      <button
        type="button"
        className="logout"
        onClick={this.logout}
      >Logout
      </button>
    );
  }
}

export default withApollo(Logout);
