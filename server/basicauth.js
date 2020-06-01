const auth   = require('basic-auth');
const config = require('config');

const basicUser = config.basic.user
const basicPass = config.basic.pass

const admins = {
  [basicUser]: { password: basicPass },
};

module.exports = function basicAuth(request, response, next) {
  const user = auth(request);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="MY OWN PAGE"');
    return response.status(401).send();
  }
  return next();
};