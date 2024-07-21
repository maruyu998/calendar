import { getPacket, postPacket } from "maruyu-webcommons/commons/utils/fetch";

export function connectGoogleCalendar({
  client_id,
  client_secret,
  redirect_uri
}){
  return postPacket("/api/v1/googlecalendar/register", { client_id, client_secret, redirect_uri }, {}, window)
  .then(({title, message, data})=>console.log({title, message, data}))
  .catch(error=>console.error(error))
}

export function getGrantGoogleCalendarUrl(){
  return getPacket("/api/v1/googlecalendar/grant", {}, window)
  .then(({title, message, data})=>{
    if(data==null) throw new Error("data is null");
    return data as { url }
  })
  .then(data=>data.url)
  .catch(error=>console.error(error))
}

export function disconnectGoogleCalendar(){
  return getPacket('/api/v1/googlecalendar/disconnect', {}, window)
  .then(({title,message,data})=>console.log({title,message,data}))
  .catch(error=>console.error(error))
}

export function refreshGoogleCalendarList(){
  return getPacket("/api/v2/external/calendar.google.com/refreshCalendarList", {}, window)
  .then(({title,message,data})=>console.log({title,message,data}))
  .catch(error=>console.error(error))
}