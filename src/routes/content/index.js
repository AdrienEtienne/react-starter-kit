/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';
import Content from './Content';

export default {

  path: '*',

  async action({ path }) { // eslint-disable-line react/prop-types
    const resp = await fetch(`/api/contents${path}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (resp.status === 500) throw new Error(resp.statusText);
    if (resp.status === 404) return undefined;
    const data = await resp.json();
    return {
      title: data.title,
      component: <Layout><Content {...data} /></Layout>,
    };
  },

};
