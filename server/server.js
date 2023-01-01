const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const config = require('config');

const basicAuth = require('./basicauth');
const Parser = require('./parse');

const moauth = new (require('moauth').client)({
  app_token_issue_server_uri: `${config.authserver}/api/get_app_token`,
  user_signin_server_uri: `${config.authserver}/signin`,
  access_token_validate_server_uri: `${config.authserver}/api/validate_access_token`,
  callback_path: '/callback',
  app_id: config.app_id, 
  app_secret: config.app_secret
})

const parser = new Parser();
const app = express();

const serverConfig = config.server;
app.use(basicAuth);

app.use(express.json({limit: '10gb'}))
app.use(express.urlencoded({ extended: false, limit:'10gb' }))
app.use(cookieParser())
app.use(session({
  secret:config.SESSION_SECRET,
  rolling : true,
  name: config.app_id,
  cookie: { 
    secure:false, 
    httpOnly:false, 
    maxAge: 3*24*60*60*1000,
  }
}))
app.get('/callback', moauth.redirect_requested_page_from_callback_path)
app.use(moauth.redirect_signin_page_if_not_login)

app.use(bodyParser.json());
app.use(express.static(config.client.static))

app.get('/api/*', async function (req, res) {
  const result = await parser.apiParser(req, "GET");
  res.send(result);
})

app.post('/api/*', async function (req, res) {
  const result = await parser.apiParser(req, "POST");
  res.send(result);
})

app.get('*', function (req, res) {
  res.status(404)
  res.sendFile(config.client.NotFound)
})

app.listen(serverConfig.port, function () {
  console.log(`server starting -> [port] ${serverConfig.port} [env] ${process.env.NODE_ENV}`)
})