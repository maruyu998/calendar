const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('config');

const basicAuth = require('./basicauth');
const Parser = require('./parse');

const parser = new Parser();
const app = express();

const serverConfig = config.server;
app.use(basicAuth);
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