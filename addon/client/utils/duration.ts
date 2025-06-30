import { MdateTz, TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import { DAY, HOUR, MINUTE } from "maruyu-webcommons/commons/utils/time";


export function createTimeRangeText(startMdate:MdateTz, endMdate:MdateTz):string{
  const start = startMdate.format("MM/DD(ddd) HH:mm","en");
  const startDateText = startMdate.format("MM/DD");
  const endDateText = endMdate.format("MM/DD");
  const format = (startDateText == endDateText) ? "HH:mm" : "MM/DD(ddd) HH:mm";
  const end = endMdate.format(format,"en");
  return `${start} ~ ${end}`;
}

export function createDurationText(startMdate:MdateTz, endMdate:MdateTz):string{
  let milliseconds = endMdate.unix - startMdate.unix;
  const days = Math.floor(milliseconds / DAY);
  milliseconds -= DAY * days;
  const hours = Math.floor(milliseconds / HOUR);
  milliseconds -= HOUR * hours;
  const minutes = Math.ceil(milliseconds / MINUTE);
  const texts = new Array<string>();
  if(days > 0) texts.push(`${days} ${days === 1 ? "day" : "days"}`)
  if(hours > 0) texts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`)
  if(minutes > 0) texts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`)
  return texts.join(", ")
}