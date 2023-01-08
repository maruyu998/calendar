import express from 'express';
import config from 'config';
import { sendJson } from '../../utils/express';
import * as connect from './connect';

const router = express.Router()

router.post('/register', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    if(user_id !== config.provider_user_id){
        return sendJson(res, {message:"you cannnot register"})
    }
    const { client_id, client_secret, redirect_uri } = req.body;
    const ret = await connect.registerGrant(client_id, client_secret, redirect_uri)
    console.log(ret)
    sendJson(res, {message: "went well"})
})

router.get('/grant', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    if(user_id !== config.provider_user_id){
        return sendJson(res, {message:"you cannnot make grant"})
    }
    const grant_url = await connect.getGrantUrl()
    if(grant_url == null) res.redirect('/?popup=show_credential')
    sendJson(res, {url: grant_url})
})

router.get('/redirect', async (req, res) => {
    if(!req.query || !req.query.code) return sendJson(res, {message: "failed"})
    const user_id = req.session.moauth_user_id;
    const code = req.query.code;
    await connect.processRedirect(user_id, code)
    res.redirect("/")
})

router.get('/purge', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    await connect.disconnect(user_id).then(ret=>{
        sendJson(res, {message:'disconnect success.'})
    }).catch(error=>{
        if(error.message === "No access token to revoke.")
            sendJson(res, {message: 'disconnected fail. connection is not found.'})
        else throw error
    })
})

export default router;
