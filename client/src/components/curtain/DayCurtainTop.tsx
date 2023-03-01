import React from 'react';
import MDate from '../../../../mutils/mdate';

export default function DayCurtainTop({date, c_timezone}:{date:MDate, c_timezone:string}){
  const isToday = date.isToday(c_timezone);
  const isSat = date.getMediumDOW(c_timezone) === "Sat";
  const isSun = date.getMediumDOW(c_timezone) === "Sun";

  return (
    <div id="dayhead" className="my-2 w-100">
      <p className="text-center my-0" style={{
        fontSize:"8px",
        color: isSat ? "cornflowerblue" : isSun ? "red" : "black",
        width: "100%"
      }}>{date.format("ddd",c_timezone)}</p>
      <p className="text-center mx-auto my-0 px-1 py-1" style={{
        fontSize:"16px",
        color: isToday ? "white" : "black",
        backgroundColor: isToday ? "tomato" : "white",
        borderRadius: "100%",
        width:"fit-content"
      }}>{date.format("M/D",c_timezone)}</p>
    </div>
  )
}