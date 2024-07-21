import { deletePacket, getPacket, postPacket, putPacket } from "maruyu-webcommons/commons/utils/fetch";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { CaleventType } from "mtypes/v2/Calevent";

export async function getCaleventList({
  calendarIds,
  startMdate,
  endMdate,
}:{
  calendarIds: string[],
  startMdate: Mdate,
  endMdate: Mdate,
}):Promise<CaleventType[]>{
  const url = new URL('/api/v2/calevent/list', window.location.href);
  url.searchParams.append("startUnix", String(startMdate.unix));
  url.searchParams.append("endUnix", String(endMdate.unix));
  url.searchParams.append("calendarIds", calendarIds.join(","))
  const caleventList = await getPacket(url.toString(), {}, window)
                      .then(({title,message,data})=>{
                        if(data==null) throw new Error("data is null");
                        
                        return data as { caleventList }
                      })
                      .then(data=>data.caleventList as CaleventType[]);
  return caleventList;
}

export async function createCalevent({
  calendarId, 
  title, 
  startMdate, 
  endMdate, 
  // isDateEvent
}:{
  calendarId: string,
  title: string, 
  startMdate: Mdate, 
  endMdate: Mdate, 
  // isDateEvent: boolean
}):Promise<CaleventType>{
  console.assert(startMdate.unix < endMdate.unix)
  return await postPacket("/api/v2/calevent/item", {
    calendarId, 
    title,
    startUnix: startMdate.unix,
    endUnix: endMdate.unix
  }, {}, window)
  .then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("calevent" in (data as object))) throw new Error("calevent is not found");
    const calevent = (data as {calevent: CaleventType}).calevent;
    return calevent;
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
}

export async function updateCalevent({
  caleventId, 
  calendarId, 
  title, 
  startMdate, 
  endMdate, 
  // isDateEvent
}:{
  caleventId: string,
  calendarId: string, 
  title?: string, 
  startMdate: Mdate, 
  endMdate: Mdate,
  // isDateEvent: boolean
}):Promise<CaleventType>{
  console.assert(startMdate.unix < endMdate.unix)
  const updateData = {
    calendarId, 
    caleventKey: caleventId, 
    startUnix: startMdate.unix,
    endUnix: endMdate.unix,
  }
  if(title) updateData["title"] = title;
  return await putPacket("/api/v2/calevent/item", updateData, {}, window)
  .then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("calevent" in (data as object))) throw new Error("calevent is not found");
    const calevent = (data as {calevent: CaleventType}).calevent;
    return calevent;
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
}

export async function deleteCalevent({
  calendarId,
  caleventId,
}:{
  calendarId: string,
  caleventId: string
}):Promise<CaleventType>{
  return await deletePacket("/api/v2/calevent/item", { 
    calendarId,
    caleventKey: caleventId,
  }, {}, window)
  .then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("calevent" in (data as object))) throw new Error("calevent is not found");
    const calevent = (data as {calevent: CaleventType}).calevent;
    return calevent;
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
}