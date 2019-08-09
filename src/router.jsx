import React from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import Main from './Main';
import LoginRegisterForm from './components/loginregister';
import User from './User';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.loggedIn === true
        ? <Component {...props} />
        : (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location },
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
            pathname: (typeof props.location.state !== typeof undefined)
              ? props.location.state.from.pathname : '/app',
          }}
          />
        )
    )}
  />
);

function NotFound() {
  return (
    <Redirect to="/" />);
}

export default function Routing(props) {
  const { changeLoginState } = props;
  const { loggedIn } = props;
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
          component={() => (
            <LoginRegisterForm
              changeLoginState={changeLoginState}
            />
          )}
          loggedIn={loggedIn}
        />
        <PrivateRoute
          path="/user/:username"
          component={props => (
            <User
              {...props}
              changeLoginState={changeLoginState}
            />
          )}
          loggedIn={loggedIn}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
