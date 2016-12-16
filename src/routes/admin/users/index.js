import React from 'react';
import Layout from '../../../components/Layout';

const title = 'Admin - Users';

export default {

  path: '/users',

  async action() {
    const Users = await new Promise((resolve) => {
      require.ensure([], (require) => resolve(require('./Users').default), 'users');
    });

    return {
      title,
      chunk: 'user',
      component: <Layout><Users title={title} /></Layout>,
    };
  },

};
