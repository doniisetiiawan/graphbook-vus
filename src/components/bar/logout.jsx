import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

class Logout extends Component {
  logout = () => {
    const { logout: logout1 } = this.props;
    logout1().then(() => {
      localStorage.removeItem('jwt');
      const { client } = this.props;
      client.resetStore();
    });
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
