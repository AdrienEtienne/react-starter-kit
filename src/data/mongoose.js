/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import mongoose from 'mongoose';
import { databaseUrl } from '../config';
import dummyData from './dummyData';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

  // MongoDB Connection
mongoose.connect(databaseUrl, {
  db: {
    safe: true,
  },
});

mongoose
  .connection
  .on('error', (error) => {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  });

dummyData();
