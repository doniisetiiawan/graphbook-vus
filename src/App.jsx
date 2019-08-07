import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import Chats from './Chats';
import Bar from './components/bar';
import './components/fontawesome';
import './App.css';
import LoginRegisterForm from './components/loginregister';

class App extends Component {
   state = {
     loggedIn: false,
   };

   componentWillMount() {
     const token = localStorage.getItem('jwt');
     if (token) {
       this.setState({ loggedIn: true });
     }
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
          <div>
            <Bar />
            <Feed />
            <Chats />
          </div>
        ) : <LoginRegisterForm changeLoginState={this.changeLoginState} />}
      </div>
    );
  }
}

export default App;
