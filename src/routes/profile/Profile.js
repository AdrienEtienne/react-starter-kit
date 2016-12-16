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
import { changePassword } from '../../actions/auth';
import MongooseError from '../../components/Utils/MongooseError';
import s from './Profile.css';

class Profile extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    changePassword: PropTypes.func.isRequired,
    statusText: PropTypes.string,
    errors: PropTypes.object.isRequired,
    cuid: PropTypes.string.isRequired,
  };


  constructor(props) {
    super(props);
    this.state = { oldPassword: '', newPassword: '', newPassword2: '', submitted: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, attr) {
    const newState = {};
    newState[attr] = event.target.value;
    this.setState(newState);
    this.setState({ submitted: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const result = await this.props.changePassword(
      this.state.oldPassword,
      this.state.newPassword,
      this.state.newPassword2,
      this.props.cuid);
    if (result) {
      this.setState({ oldPassword: '', newPassword: '', newPassword2: '' });
    }
  }

  render() {
    let errors = {};
    let message = null;
    if (this.state.submitted) {
      message = this.props.statusText;
      errors = this.props.errors;
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <form onSubmit={this.handleSubmit}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">Current Password</label>
              <input
                className={s.input}
                type="password"
                name="password"
                value={this.state.oldPassword} onChange={(e) => this.handleChange(e, 'oldPassword')}
                required
              />
              <MongooseError error={errors.oldPassword} />
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">New Password</label>
              <input
                className={s.input}
                type="password"
                name="password"
                value={this.state.newPassword} onChange={(e) => this.handleChange(e, 'newPassword')}
                required
              />
              <MongooseError error={errors.newPassword} />
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">Confirm New Password</label>
              <input
                className={s.input}
                type="password"
                name="password"
                value={this.state.newPassword2} onChange={(e) => this.handleChange(e, 'newPassword2')}
                required
              />
              <MongooseError error={errors.newPassword2} />
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Change Password
              </button>
              <p>{message}</p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  errors: state.auth.errors,
  cuid: state.auth.cuid,
  statusText: state.auth.statusText,
});
const mapDispatch = {
  changePassword,
};

export default withStyles(s)(connect(mapState, mapDispatch)(Profile));
