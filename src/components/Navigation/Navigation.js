/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import { logoutAndRedirect } from '../../actions/auth';
import { isAdmin } from '../../reducers/auth';

class Navigation extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    logoutAndRedirect: PropTypes.func.isRequired,
  };

  render() {
    let buttons = null;
    if (!this.props.isAuthenticated) {
      buttons = (<span>
        <Link className={s.link} to="/login">Log in</Link>
        <span className={s.spacer}>or</span>
        <Link className={cx(s.link, s.highlight)} to="/register">Sign up</Link>
      </span>);
    } else {
      buttons = <Link className={s.link} to="/login" onClick={this.props.logoutAndRedirect}>Log out</Link>;
    }

    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        {this.props.userName ? <span>Welcome {this.props.userName} - </span> : null}

        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>

        {this.props.isAdmin ? <span className={s.spacer}> | </span> : null}
        {this.props.isAdmin ? <Link className={s.link} to="/admin">Administration</Link> : null}

        <span className={s.spacer}> | </span>
        {buttons}
      </div>
    );
  }
}

const mapState = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userName: state.auth.userName,
  isAdmin: isAdmin(state),
});
const mapDispatch = {
  logoutAndRedirect,
};

export default withStyles(s)(connect(mapState, mapDispatch)(Navigation));

