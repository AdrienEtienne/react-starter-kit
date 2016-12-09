/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import { isAdmin } from '../../reducers/auth';

const title = 'Admin Page';

export default {

  path: '/admin',

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

};
