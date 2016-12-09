/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// A folder with Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './content');

// Extract 'front matter' metadata and generate HTML
const parseContent = (path, fileContent, extension) => {
  const fmContent = fm(fileContent);
  let htmlContent;
  switch (extension) {
    case '.md':
      htmlContent = md.render(fmContent.body);
      break;
    case '.html':
      htmlContent = fmContent.body;
      break;
    default:
      return null;
  }
  return Object.assign({ path, content: htmlContent }, fmContent.attributes);
};

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

async function resolveExtension(path, extension) {
  let fileNameBase = join(CONTENT_DIR, `${path === '/' ? '/index' : path}`);
  let ext = extension;
  if (!ext.startsWith('.')) {
    ext = `.${extension}`;
  }

  let fileName = fileNameBase + ext;

  if (!(await fileExists(fileName))) {
    fileNameBase = join(CONTENT_DIR, `${path}/index`);
    fileName = fileNameBase + ext;
  }

  if (!(await fileExists(fileName))) {
    return { success: false };
  }

  return { success: true, fileName };
}

async function resolveFileName(path) {
  const extensions = ['.md', '.html'];

  for (let i = 0; i < extensions.length; i += 1) {
    const extension = extensions[i];
    const maybeFileName = await resolveExtension(path, extension);
    if (maybeFileName.success) {
      return { success: true, fileName: maybeFileName.fileName, extension };
    }
  }

  return { success: false, fileName: null, extension: null };
}

export default async function get(req, res) {
  const path = req.params.path;

  const { success, fileName, extension } = await resolveFileName(path);
  if (!success) {
    return res.status(404).end();
  }

  try {
    const source = await readFile(fileName, { encoding: 'utf8' });
    const data = parseContent(path, source, extension);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).send(error);
  }
}
