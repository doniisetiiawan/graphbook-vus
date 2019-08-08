import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { withApollo } from 'react-apollo';
import Feed from './Feed';
import Chats from './Chats';
import Bar from './components/bar';
import LoginRegisterForm from './components/loginregister';
import CurrentUserQuery from './components/queries/currentUser';
import './components/fontawesome';
import './App.css';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = props.client.onResetStore(
      () => this.changeLoginState(false),
    );
  }

   state = {
     loggedIn: false,
   };

   componentWillMount() {
     const token = localStorage.getItem('jwt');
     if (token) {
       this.setState({ loggedIn: true });
     }
   }

   componentWillUnmount() {
     this.unsubscribe();
   }

  changeLoginState = (loggedIn) => {
    this.setState({ loggedIn });
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <div className="container">
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta
            name="description"
            content="Newsfeed of all your friends on Graphbook"
          />
        </Helmet>
        {loggedIn ? (
          <CurrentUserQuery>
            <Bar changeLoginState={this.changeLoginState} />
            <Feed />
            <Chats />
          </CurrentUserQuery>
        ) : <LoginRegisterForm changeLoginState={this.changeLoginState} />}
      </div>
    );
  }
}

export default withApollo(App);
