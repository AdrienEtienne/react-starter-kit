/* eslint-disable global-require */

import React from 'react';
import Layout from '../../components/Layout';
import { isAdmin } from '../../reducers/auth';

const title = 'Admin Page';

export default {

  path: '/admin',

  children: [
    {
      path: '/',
      async action(context) {
        if (!isAdmin(context.store.getState())) {
          return { redirect: '/login' };
        }

        const Admin = await new Promise((resolve) => {
          require.ensure([], (require) => resolve(require('./Admin').default), 'admin');
        });

        return {
          title,
          chunk: 'admin',
          component: <Layout><Admin title={title} /></Layout>,
        };
      },
    },
    require('./users').default,
  ],

  action() {
    return null;
  },

};
