import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import Main from './Main';
import LoginRegisterForm from './components/loginregister';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.loggedIn === true
        ? <Component {...props} />
        : (
          <Redirect to={{
            pathname: '/',
          }}
          />
        )
    )}
  />
);

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.loggedIn === false
        ? <Component {...props} />
        : (
          <Redirect to={{
            pathname: '/app',
          }}
          />
        )
    )}
  />
);

export default function Routing(props) {
  const { changeLoginState } = props;
  const { loggedIn } = props;
  const {
    loggedIn: loggedIn1,
    changeLoginState: changeLoginState1,
  } = props;
  return (
    <Router>
      <Switch>
        <PrivateRoute
          path="/app"
          component={() => <Main changeLoginState={changeLoginState} />}
          loggedIn={loggedIn}
        />
        <LoginRoute
          exact
          path="/"
          component={() => <LoginRegisterForm changeLoginState={changeLoginState1} />}
          loggedIn={loggedIn1}
        />
      </Switch>
    </Router>
  );
}
