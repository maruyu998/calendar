const path = require('path');
const secret = require('./secret');

module.exports = {
  server: {
    port: 5601
  },
  mongo: {
    authflg: false,
    address: "localhost",
  },
  client: {
    static: path.join(__dirname, '../', '../', 'webComponents'),
    NotFound: path.join(__dirname, '../', '../', 'webComponents', '404.html')
  }
}