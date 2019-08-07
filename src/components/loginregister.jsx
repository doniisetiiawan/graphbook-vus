import React, { Component } from 'react';
import Error from './error';
import LoginMutation from './mutations/login';

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();
    const { login: login1 } = this.props;
    const { password, email } = this.state;
    login1({
      variables: {
        email,
        password,
      },
    });
  };

  render() {
    const { error } = this.props;
    return (
      <div className="login">
        <form onSubmit={this.login}>
          <label>Email</label>
          <input
            type="text"
            onChange={event => this.setState(
              { email: event.target.value },
            )}
          />
          <label>Password</label>
          <input
            type="password"
            onChange={event => this.setState(
              { password: event.target.value },
            )}
          />
          <input type="submit" value="Login" />
        </form>
        {error && (
          <Error><p>There was an error logging in!</p></Error>
        )}
      </div>
    );
  }
}

export default function LoginRegisterForm(props) {
  const { changeLoginState } = props;
  return (
    <div className="authModal">
      <LoginMutation changeLoginState={changeLoginState}>
        <LoginForm />
      </LoginMutation>
    </div>
  );
}
