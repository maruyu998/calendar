const path = require('path');
const secret = require('./secret');
require('dotenv').config()

module.exports = {
  server: {
    port: process.env.PRODUCTION_PORT
  },
  mongo: {
    authflg: true,
    user: secret.mongo.user,
    pass: secret.mongo.pass,
    address: secret.mongo.address,
    authDatabase: secret.mongo.authDatabase,
  },
  authserver: "https://auth.maruyu.work",
  client: {
    static: path.join(__dirname, '../', '../', 'webComponents'),
    NotFound: path.join(__dirname, '../', '../', 'webComponents', '404.html')
  }
}