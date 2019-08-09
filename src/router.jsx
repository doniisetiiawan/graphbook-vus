import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './Main';

export default function Routing(props) {
  const { changeLoginState } = props;
  return (
    <Router>
      <Switch>
        <Route
          path="/app"
          component={() => (
            <Main changeLoginState={changeLoginState} />
          )}
        />
      </Switch>
    </Router>
  );
}
