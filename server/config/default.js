const secret = require('./secret');

module.exports = {
  basic: secret.basic,
  HASHSALT: secret.HASHSALT,
  SESSION_SECRET: secret.SESSION_SECRET,
  app_id: "calendar",
  app_secret: secret.app_secret
}