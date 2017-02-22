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

import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import _ from 'lodash';
import archiver from 'archiver';
import { cleanDir, writeFile, makeDir } from './lib/fs';
import { name, version } from '../package.json';

function execAsync(...args) {
  return new Promise((resolve, reject) => {
    exec(...args, (error, output) => {
      if (error) reject(error);
      else resolve(output);
    });
  });
}

async function writeScripts(appFile, env, run) {
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

  await writeFile('build/start.bat', start);
}

function zip(output) {
  return new Promise((resolve, reject) => {
    let platform = '';
    let archiveExtension = '';
    if (os.platform() === 'win32') {
      platform = 'win';
      archiveExtension = 'zip';
    } else {
      platform = os.platform();
      archiveExtension = 'tar';
    }
    const arch = os.arch();

    const ws = fs.createWriteStream(
      `${output}/${name}_${version}_${platform}_${arch}.${archiveExtension}`);
    const archive = archiver(archiveExtension, {
      store: true,
    });

    ws.on('close', () => resolve());
    archive.on('error', (e) => reject(e));
    archive.pipe(ws);
    archive.directory('build', '');
    archive.finalize();
  });
}

async function execute(config = {}) {
  const appFile = config.appFile || 'index.js';
  const run = config.run;
  const output = config.output || 'pack';
  const env = config.env || {};

  console.log(`CLEAN OUTPUT FOLDER : ${output}`);
  await cleanDir(output);
  console.log('INSTALL DEPENDANCIES');
  await execAsync('cd ./build && npm install --production');
  console.log('WRITE SCRIPTS');
  await writeScripts(appFile, env, run);
  console.log('CREATE ARCHIVE');
  await makeDir(output);
  await zip(output);
}

export default async function pack() {
  await execute({
    appFile: 'server.js',
    src: 'build',
    run: 'npm start',
    output: 'pack',
    env: {
      WEBSITE_HOSTNAME: '127.0.0.1:8080',
      PORT: 8080,
    },
  });

  return true;
}
