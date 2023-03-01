import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import MDate from '../../../../mutils/mdate';
import { timezones } from "../../../../mtypes/date";

export default function TopBar({
    startDate, setStartDate,
    c_showSide, cset_showSide,
    c_showDateCount, cset_showDateCount,
    c_heightScale, cset_heightScale,
    c_timezone, cset_timezone
}:{
  startDate:MDate, setStartDate,
  c_showSide:string, cset_showSide,
  c_showDateCount:string, cset_showDateCount,
  c_heightScale:string, cset_heightScale,
  c_timezone:string, cset_timezone
}){
    
  const [popup, setPopup] = useState<string|null>(null);
  useEffect(()=>{
    setPopup((new URL(window.location.href)).searchParams.get('popup'))
  }, [])

  return (
    <div>
        <Popup open={popup==="show_credential"}>
        <div className="p-5 bg-white shadow-lg">
          <h1>Google Calendar Credentials</h1>
          <p>pick the credential data from GCP console</p>
          <form name="show_credential" onSubmit={e=>{
              e.preventDefault();
              fetch("/api/googlecalendar/register", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  client_id: (document.getElementById('client_id') as HTMLInputElement)?.value,
                  client_secret: (document.getElementById('client_secret') as HTMLInputElement)?.value,
                  redirect_uri: (document.getElementById('redirect_uri') as HTMLInputElement)?.value
                })
              }).then(res=>res.json()).then(res=>{
                console.log(res)
                // window.location = "/"
              })
            }}>
            <div className="mb-3">
              <label htmlFor="client_id" className="form-level">client_id</label>
              <input type="text" id="client_id" className="form-control"/>
            </div>
            <div className="mb-3">
              <label htmlFor="client_secret" className="form-level">client_secret</label>
              <input type="text" id="client_secret" className="form-control"/>
            </div>
            <div className="mb-3">
              <label htmlFor="redirect_uri" className="form-level">redirect_uri</label>
              <input type="text" id="redirect_uri" className="form-control"/>
            </div>
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>
      </Popup>
      <div id="header">
        <div className="d-flex">
          <button type="button" className="btn btn-light"
                  onClick={()=>cset_showSide(String(c_showSide!=="true"))}>
            <i className={!(c_showSide==="true")?"bi bi-list":"bi bi-x-lg"}></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(startDate.add(-Number(c_showDateCount),"day"))}>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(startDate.add(-1,"day"))}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(startDate.add(1,"day"))}>
            <i className="bi bi-chevron-right"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(startDate.add(Number(c_showDateCount),"day"))}>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(MDate.now().getResetTime(c_timezone))}>
            <p className="my-0">Today</p>
          </button>
          <div className="input-group" style={{maxWidth:"200px"}}>
            <input type="date" className="form-control" aria-label="StartDate" 
              value={startDate.format("YYYY-MM-DD", c_timezone)}
              onChange={e=>setStartDate(MDate.parse(e.target.value, c_timezone, "YYYY-MM-DD"))}
            />
          </div>
          <div className="flex-grow-1">
            <div className="input-group">
              <input type="number" className="form-control" aria-label="DateCount" 
                defaultValue={Number(c_showDateCount)}
                min={1}
                onChange={e=>cset_showDateCount(Number(e.target.value))}
              />
              <span className="input-group-text">Days</span>
            </div>
          </div>
          <div className="input-group" style={{maxWidth:"200px"}}>
            <input type="range" className="form-range my-auto" min="0" max="500" id="HeightScale" 
                   defaultValue={Number(c_heightScale)}
                   onChange={e=>cset_heightScale(String(Number(e.target.value)))}/>
          </div>
          <div className="input-group" style={{maxWidth:"200px"}}>
            <select className="form-select" onChange={e=>cset_timezone(String(e.target.value))}>
              {timezones.map((tz,i)=>(
                <option key={i} value={tz} defaultChecked={tz===c_timezone}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}