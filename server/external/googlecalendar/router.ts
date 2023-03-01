import express from 'express';
import config from 'config';
import { sendJson } from '../../utils/express';
import * as connect from './connect';
import * as sync from './sync';
import MDate from '../../../mutils/mdate';
import { CalendarEventGroup } from '../../../mtypes/CalendarEvent';

const router = express.Router()

router.post('/register', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    if(user_id !== config.provider_user_id){
        return sendJson(res, {message:"you cannnot register"})
    }
    const { client_id, client_secret, redirect_uri } = req.body;
    const ret = await connect.registerGrant(client_id, client_secret, redirect_uri)
    sendJson(res, {message: `went well, ${ret}`})
})

router.get('/grant', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    if(user_id !== config.provider_user_id){
        return sendJson(res, {message:"you cannnot make grant"})
    }
    const grant_url = await connect.getGrantUrl()
    if(grant_url == null) res.redirect('/?popup=show_credential')
    sendJson(res, {url: grant_url!!})
})

router.get('/redirect', async (req, res) => {
    if(!req.query || !req.query.code) return sendJson(res, {message: "failed"})
    const user_id = req.session.moauth_user_id;
    const code = req.query.code;
    await connect.processRedirect(user_id, code)
    res.redirect("/")
})

router.get('/disconnect', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    await connect.disconnect(user_id).then(ret=>{
        sendJson(res, {message:'disconnect success.'})
    }).catch(error=>{
        if(error.message === "No access token to revoke.")
            sendJson(res, {message: 'disconnected fail. connection is not found.'})
        else throw error
    })
})

router.get('/calendarList', async (req, res) => {
    const user_id = req.session.moauth_user_id;
    const calendarList = await sync.getCalendarList(user_id);
    sendJson(res, {calendarList})
})

router.get('/refreshCalendarList', async (req, res)=>{
    const user_id = req.session.moauth_user_id;
    await sync.refreshCalendarList(user_id);
    sendJson(res, {message: "success"})
})

router.get('/events', async (req, res)=>{
    const user_id = req.session.moauth_user_id!;
    if(req.query.start_date === undefined || req.query.end_date === undefined){
        return sendJson(res, {message: "start_date and end_date is required."})
    }
    if(req.query.timezone === undefined){
        return sendJson(res, {message: "timezone is required."})
    }
    const timezone = String(req.query.timezone!);
    const start_date = MDate.parse(String(req.query.start_date!), timezone, "YYYY-MM-DD");
    const end_date = MDate.parse(String(req.query.end_date!), timezone, "YYYY-MM-DD");
    const gcids = String(req.query.gcids||"").split(",")
    const events = await sync.refleshCalendarsEvents(user_id, start_date, end_date, gcids)
    const group = req.query.group;
    if(events===null){
        return sendJson(res, {message: "error"})
    }
    // if(!group) return sendJson(res, {events})
    if(!group) return res.json({events})
    if(group === "date"){
        const eventGroup = {}
        for(let event of events){
            const startDateString:string = (event.start_datetime ? event.start_datetime.getDateString(timezone) : "") as string;
            const endDateString:string = (event.end_datetime ? event.end_datetime.getDateString(timezone) : "") as string;
            if(eventGroup[startDateString] === undefined) eventGroup[startDateString] = []
            eventGroup[startDateString].push(event)
            if(startDateString!==endDateString){
                if(eventGroup[endDateString] === undefined) eventGroup[endDateString] = []
                eventGroup[endDateString].push(event)
            }
        }
        // return sendJson(res, {eventGroup})
        return res.json({eventGroup})
    }
})

export default router;