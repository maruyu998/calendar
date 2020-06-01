const secret = require('./secret');

module.exports = {
  basic: {
    user : secret.basic.user,
    pass : secret.basic.pass,
  }
}