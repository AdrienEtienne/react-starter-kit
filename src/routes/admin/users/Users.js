import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { getUsers, removeUser } from '../../../actions/admin';
import s from './Users.css';

const roleHtml = (role) => {
  if (role === 'admin') return <code className={s.code}>Admin</code>;
  return null;
};

class Users extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    getUsers: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    await this.props.getUsers();
  }

  remove(key) {
    return () => {
      if (this.props.users[key]) this.props.removeUser(this.props.users[key].cuid);
    };
  }

  render() {
    const usersHtml = this.props.users.map((user, key) => (<div key={key} className={s.user}>
      <strong className={s.name}>{user.name}</strong> {roleHtml(user.role)}
      <br />
      <span className={s.email}>{user.email}</span>
      <button onClick={this.remove(key)}>Delete</button>
    </div>));

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          {usersHtml}
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  users: state.admin.users,
});
const mapDispatch = {
  getUsers,
  removeUser,
};

export default withStyles(s)(connect(mapState, mapDispatch)(Users));
