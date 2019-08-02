import React from 'react';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import './App.css';

function App() {
  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta name="description" content="Newsfeed of all your friends on Graphbook" />
      </Helmet>
      <Feed />
    </div>
  );
}

export default App;
