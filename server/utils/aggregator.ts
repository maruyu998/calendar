import fetch from 'node-fetch';
import { URL } from 'node:url';

type Service = "calendar"|"credential";
type DataType = "event"|"events"|"googlecalendar_credentials"|"googlecalendar_tokens"|"calendar"|"calendars"|"tz";

export async function getData(service:Service,datatype:DataType,user_id:string,queries:{key:string,value:string}[]=[]){
    const url = new URL(`https://aggregator.maruyu.work/${service}/${datatype}`)
    url.searchParams.append('user_id', user_id)
    for(let query of queries) url.searchParams.append(query.key, query.value)
    return await fetch(url.href, {
        headers: {
            // "Authorization": "Bearer ",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(res=>res.json())
}

export async function postData(service:Service,datatype:DataType,user_id:string,data:any){
    const url = new URL(`https://aggregator.maruyu.work/${service}/${datatype}`)
    url.searchParams.append('user_id', user_id)
    return await fetch(url.href, {
        headers: {
            // "Authorization": "Bearer ",
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:"POST",
        body: JSON.stringify({data})
    }).then(res=>res.json())
}

export async function deleteData(service:Service,datatype:DataType,user_id:string,queries:{key:string,value:string}[]=[]){
    const url = new URL(`https://aggregator.maruyu.work/${service}/${datatype}`)
    url.searchParams.append('user_id', user_id)
    for(let query of queries) url.searchParams.append(query.key, query.value)
    return await fetch(url.href, {
        headers: {
            // "Authorization": "Bearer ",
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:"DELETE"
    })
}

export async function updateData(service:Service,datatype:DataType,user_id:string,queries:{key:string,value:string}[]=[],data:any){
    const url = new URL(`https://aggregator.maruyu.work/${service}/${datatype}`)
    url.searchParams.append('user_id', user_id)
    for(let query of queries) url.searchParams.append(query.key, query.value)
    return await fetch(url.href, {
        headers: {
            // "Authorization": "Bearer ",
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:"PUT",
        body: JSON.stringify({data})
    })
}