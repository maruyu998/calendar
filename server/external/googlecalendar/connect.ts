import { google } from 'googleapis';
import { deleteData, getData, postData, updateData } from '../../utils/aggregator';
import config from "config";

let _oAuth2Client;
async function getOAuth2Client(){
    if(_oAuth2Client) return _oAuth2Client;
    const credentials = await getData("calendar","googlecalendar_credentials",config.provider_user_id).then(res=>res.credentials)
    if(credentials == null) return null;
    const { client_id, client_secret, redirect_uri } = credentials;
    _oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    return _oAuth2Client;
}

async function getCalendar(user_id){
    const oAuth2Client = await getOAuth2Client()
    const token = await getData("credential","googlecalendar_tokens",user_id)?.then(res=>res.value)
    if(!token) { console.error(`register google calendar connection for ${user_id}`); return }
    oAuth2Client.setCredentials(token)
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    return calendar
}

export async function registerGrant(client_id, client_secret, redirect_uri){
    await postData("calendar","googlecalendar_credentials",config.provider_user_id,{
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
    return await oAuth2Client.revokeCredentials().then(async res=>{
        await deleteData("credential","googlecalendar_tokens",user_id)
    })
}

export async function processRedirect(user_id, code){
    const oAuth2Client = await getOAuth2Client()
    
    const token = await oAuth2Client.getToken(code).then(res=>res.tokens)
    oAuth2Client.setCredentials(token);

    return await updateData("credential","googlecalendar_tokens",user_id,[],{token})
}