import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { withApollo } from 'react-apollo';
import '../../components/fontawesome';
import Router from '../../router';

class App extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    loggedIn: this.props.loggedIn,
  };

  changeLoginState = (loggedIn) => {
    this.setState({ loggedIn });
  };

  render() {
    const { context, location } = this.props;
    const { loggedIn } = this.state;
    return (
      <div>
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta
            name="description"
            content="Newsfeed of all your friends on Graphbook"
          />
        </Helmet>
        <Router
          loggedIn={loggedIn}
          changeLoginState={this.changeLoginState}
          location={location}
          context={context}
        />
      </div>
    );
  }
}

export default withApollo(App);
