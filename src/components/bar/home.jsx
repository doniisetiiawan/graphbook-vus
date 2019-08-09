import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  goHome = () => {
    const { history } = this.props;
    history.push('/app');
  };

  render() {
    return (
      <button
        type="button"
        className="goHome"
        onClick={this.goHome}
      >Home
      </button>
    );
  }
}

export default withRouter(Home);
