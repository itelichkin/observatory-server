const nconf = require('nconf');
const path = require('path');

nconf.argv()
  .env()
  .file({ file: './config/config.json' });

module.exports = nconf;
