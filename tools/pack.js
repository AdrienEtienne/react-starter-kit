/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Creates application bundles from the source files.
 */

import del from 'del';
import copydir from 'copy-dir';
import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import _ from 'lodash';
import archiver from 'archiver';
import { name, version } from '../package.json';

function execAsync(...args) {
  return new Promise((resolve, reject) => {
    exec(...args, (error, output) => {
      if (error) reject(error);
      else resolve(output);
    });
  });
}

function writeScripts(appFile, output, env, run) {
  let start = '';
  if (os.platform() === 'win32') {
    _.forEach(env, (value, key) => {
      start += `
SET ${key}=${value}`;
    });
  } else {
    _.forEach(env, (value, key) => {
      start += `
${key}=${value}`;
    });
  }

  start += `
  
${run}`;

  fs.writeFileSync(`${output}/tmp/start.bat`, start);
}

function zip(output) {
  return new Promise((resolve, reject) => {
    const platform = os.platform() === 'win32' ? 'win' : os.platform();
    const arch = os.arch();

    const ws = fs.createWriteStream(`${output}/${name}_${version}_${platform}_${arch}.zip`);
    const archive = archiver('zip', {
      store: true,
    });

    ws.on('close', () => resolve());
    archive.on('error', (e) => reject(e));
    archive.pipe(ws);
    archive.directory(`${output}/tmp`, '');
    archive.finalize();
  });
}

async function execute(config = {}) {
  const appFile = config.appFile || 'index.js';
  const src = config.src || 'build';
  const output = config.output || 'pack';
  const run = config.run;
  const env = config.env || {};

  console.log(`CLEAN OUTPUT FOLDER : ${output}`);
  await del([`${output}/**`]);
  console.log(`COPY OUTPUT FOLDER : ${output}`);
  copydir.sync(src, `${output}/tmp`);
  console.log('INSTALL DEPENDANCIES');
  await execAsync(`cd ./${output}/tmp && npm install --production`);
  console.log('WRITE SCRIPTS');
  writeScripts(appFile, output, env, run);
  console.log('CREATE ARCHIVE');
  await zip(output);
}

export default async function pack() {
  await execute({
    appFile: 'server.js',
    src: 'build',
    output: 'pack',
    run: 'npm start',
    env: {
      WEBSITE_HOSTNAME: '127.0.0.1:8080',
      PORT: 8080,
    },
  });

  return true;
}
