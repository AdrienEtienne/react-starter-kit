import React from 'react';
import Layout from '../../components/Layout';
import { isAuthenticated } from '../../reducers/auth';

const title = 'Profile';

export default {

  path: '/profile',

  async action(context) {
    if (!isAuthenticated(context.store.getState())) {
      return { redirect: '/' };
    }

    const Profile = await new Promise((resolve) => {
      require.ensure([], (require) => resolve(require('./Profile').default), 'profile');
    });

    return {
      title,
      chunk: 'profile',
      component: <Layout><Profile title={title} /></Layout>,
    };
  },

};
