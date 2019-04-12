const {readFile, writeFile, copy} = require('fs-extra');
const homepage = require('./package.json').homepage;
const version = require('./package.json').version;
const repository = require('./package.json').repository;

const inputIndexPath = `${__dirname}/app/electronIndex.html`;

const outputIndexPath = `${__dirname}/app/electronIndex.html`;

let fixed;
let fixed404;

readFile(inputIndexPath, 'utf8')
  .then(str => {
    fixed = str
      .replace(/="\//g, `="${homepage}/`)
      .replace(/window.__PUBLIC_URL__ = '[^']*';/g, `window.__PUBLIC_URL__ = '${homepage}';`)
      .replace(/window.__DICTO_VERSION__ = '[^']*';/g, `window.__DICTO_VERSION__ = '${version}';`)
      .replace(/window.__SOURCE_REPOSITORY__ = '[^']*';/g, `window.__SOURCE_REPOSITORY__ = '${repository}';`)
    return writeFile(outputIndexPath, fixed, 'utf8')
  })
  .catch(console.error)