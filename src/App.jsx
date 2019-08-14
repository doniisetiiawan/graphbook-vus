/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { withApollo } from 'react-apollo';
import Router from './router';
import './components/fontawesome';
import './App.css';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = props.client.onResetStore(
      () => this.changeLoginState(false),
    );
  }

   state = {
     loggedIn: (typeof window.__APOLLO_STATE__ !== typeof undefined
       && typeof window.__APOLLO_STATE__.ROOT_QUERY !== typeof undefined
       && typeof window.__APOLLO_STATE__.ROOT_QUERY.currentUser !== typeof undefined),
   };

   componentWillUnmount() {
     this.unsubscribe();
   }

  changeLoginState = (loggedIn) => {
    this.setState({ loggedIn });
  };

  render() {
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
        />
      </div>
    );
  }
}

export default withApollo(App);
