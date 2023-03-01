import { google } from 'googleapis';
import { deleteData, getData, postData, updateData } from '../../utils/aggregator';
import config from "config";

async function getOAuth2Client(){
    const credentials = await getData("calendar","googlecalendar_credentials",config.provider_user_id).then(res=>res.credentials)
    if(credentials == null) return null;
    const { client_id, client_secret, redirect_uri } = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    return oAuth2Client;
}

export async function getToken(user_id){
    const token = await getData("calendar","googlecalendar_tokens",user_id)?.then(res=>res.token)
    return token
}

export async function getCalendar(user_id){
    const oAuth2Client = await getOAuth2Client()
    if(oAuth2Client == null) return null
    const token = await getToken(user_id);
    if(!token) { console.error(`register google calendar connection for ${user_id}`); return null }
    oAuth2Client.setCredentials(token)
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    return calendar
}

export async function registerGrant(client_id, client_secret, redirect_uri){
    await updateData("calendar","googlecalendar_credentials",config.provider_user_id,[],{
        client_id, client_secret, redirect_uri
    })
}

export async function getGrantUrl(){
    const oAuth2Client = await getOAuth2Client()
    if(oAuth2Client == null) return null;
    const grant_url = await oAuth2Client.generateAuthUrl({ 
        access_type: 'offline', 
        scope: ['https://www.googleapis.com/auth/calendar'], 
        include_granted_scopes: true,
        response_type: "code"
    });
    return grant_url
}

export async function disconnect(user_id){
    const oAuth2Client = await getOAuth2Client()
    if(oAuth2Client == null) return null;
    return await oAuth2Client.revokeCredentials().then(async res=>{
        await deleteData("calendar","googlecalendar_tokens",user_id)
    })
}

export async function processRedirect(user_id, code){
    const oAuth2Client = await getOAuth2Client()
    if(oAuth2Client == null) return null;
    const token = await oAuth2Client.getToken(code).then(res=>res.tokens)
    oAuth2Client.setCredentials(token);

    return await updateData("calendar","googlecalendar_tokens",user_id,[],{token})
}