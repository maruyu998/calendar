import express from "express";
import config from "config";
import session from "express-session";
import connect_mongo_session from "connect-mongodb-session";
import { client as moauthClient } from 'moauth';
import path from 'path';

import router from './router';

declare module 'express-session' {
  interface SessionData {
    moauth_user_id: string
  }
}

const MongoDBStore = connect_mongo_session(session);

const moauth = new moauthClient({
  app_token_issue_server_uri: `${config.moauth_server}/api/get_app_token`,
  user_signin_server_uri: `${config.moauth_server}/signin`,
  access_token_validate_server_uri: `${config.moauth_server}/api/validate_access_token`,
  callback_path: '/callback',
  app_id: config.app_id, 
  app_secret: config.app_secret
})

const app: express.Express = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: config.session_secret,
  store: new MongoDBStore({
    uri: config.mongo_path,
    collectionName: 'sessions',
    autoRemove: 'native'
  }),
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
}))
app.get('/callback', moauth.redirect_requested_page_from_callback_path)
app.use(moauth.redirect_signin_page_if_not_login)

app.use(express.static(path.join(__dirname, '..', 'client', 'public')))
app.use('/api', router)

app.listen(3000, ()=>{
  console.log("starting")
})