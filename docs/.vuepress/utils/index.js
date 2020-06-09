const glob = require('glob');
const meta = require('markdown-it-meta');
const markdownIt = require('markdown-it');
const fs = require('fs');
const _ = require('lodash');

const md = new markdownIt();
md.use(meta);

const generateSidebar = (title, src) => {
  const files = getMdFilesPath(src, 'README.md');
  const children = _.sortBy(files, ['order', 'path']).map(file => file.path);
  const path = getReadmePath(src);

  return {
    title,
    children,
    path,
  };
};

const getMdFilesPath = (src, ignoredFilename) => {
  const pattern = generatePattern(src);
  const ignoredFilePattern = generatePattern(src, ignoredFilename);

  const files = glob.sync(pattern, { ignore: ignoredFilePattern }).map(path => {

    const file = fs.readFileSync(path, 'utf8');
    md.render(file);

    path = path.replace('docs/', '');
    const order = md.meta.order;

    return {
      path,
      order,
    };
  });

  return files;
};

const generatePattern = (src, filename) => {

  return `docs/${src}/**/${filename || '*.md'}`;
};

const getReadmePath = (src) => {
  const pattern = generatePattern(src, 'README.md');

  return glob.sync(pattern)[0] ? `/${src}/` : '';
};

module.exports = {
  generateSidebar
};