import React from 'react';
import loadable from 'react-loadable';
import Loading from './components/loading';

const User = loadable({
  loader: () => import('./User'),
  loading: Loading,
});
const Main = loadable({
  loader: () => import('./Main'),
  loading: Loading,
});
const LoginRegisterForm = loadable({
  loader: () => import('./components/loginregister'),
  loading: Loading,
});

const ReactRouter = require('react-router-dom');

let Router;
if (typeof window !== typeof undefined) {
  const { BrowserRouter } = ReactRouter;
  Router = BrowserRouter;
} else {
  const { StaticRouter } = ReactRouter;
  Router = StaticRouter;
}
const { Route, Redirect, Switch } = ReactRouter;

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
  const { context, location } = props;
  return (
    <Router context={context} location={location}>
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
