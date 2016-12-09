/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { signUp } from '../../actions/auth';
import MongooseError from '../../components/Utils/MongooseError';
import s from './Register.css';

class Register extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    signUp: PropTypes.func.isRequired,
    errors: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { name: '', email: '', password: '', submitted: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, attr) {
    const newState = {};
    newState[attr] = event.target.value;
    this.setState(newState);
    this.setState({ submitted: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    this.props.signUp(this.state.name, this.state.email, this.state.password);
  }

  render() {
    let errors = {};
    if (this.state.submitted) errors = this.props.errors;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <form onSubmit={this.handleSubmit}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="name">
                Name:
              </label>
              <input
                className={s.input}
                type="text"
                name="fullname"
                value={this.state.value} onChange={(e) => this.handleChange(e, 'name')}
                autoFocus
                required
              />
              <MongooseError error={errors.name} />
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="email">
                Email address:
              </label>
              <input
                className={s.input}
                type="text"
                name="email"
                value={this.state.value} onChange={(e) => this.handleChange(e, 'email')}
                required
              />
              <MongooseError error={errors.email} />
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">
                Password:
              </label>
              <input
                className={s.input}
                type="password"
                name="password"
                value={this.state.value} onChange={(e) => this.handleChange(e, 'password')}
                required
              />
              <MongooseError error={errors.password} />
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  errors: state.auth.errors,
});
const mapDispatch = {
  signUp,
};

export default withStyles(s)(connect(mapState, mapDispatch)(Register));
