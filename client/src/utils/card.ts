import { hsvToRgb, parseColor, printColor, rgbToHsv } from "maruyu-webcommons/commons/utils/color";
import { Mdate, MdateTz } from "maruyu-webcommons/commons/utils/mdate";
import { CalendarType } from "mtypes/v2/Calendar";
import { CaleventClientType } from "mtypes/v2/Calevent";

export function getBackgroundColor(calevent: CaleventClientType){
  const color = (
    calevent.style.mainColor ? calevent.style.mainColor
    : calevent.calendar.calendarSource == "calendar.google.com" ? calevent.calendar.data.backgroundColor
    : calevent.calendar.calendarSource == "health.maruyu.work" ? calevent.calendar.data.backgroundColor
    : undefined
  ) ?? "#333333";
  if(calevent.endMdate.unix >= Mdate.now().unix) return color;
  const { hue, saturation, value } = rgbToHsv(parseColor(color));
  return printColor(hsvToRgb({hue, saturation:saturation/3, value}));
}

export function getFontSize({
  width,
  height
}:{
  width: number,
  height: number
}){
  if(height > 30 && width > 50) return "0.65em";
  if(height > 30 && width <= 50) return "0.6em";
  if(height <= 30 && width > 50) return "0.6em";
  return "0.4em";
}

export function getMarginTop({
  height
}:{
  height: number
}){
  if(height > 30) return "";
  if(height > 15) return "-0.2em";
  return "-0.4em";
}

export function getTexts({
  width,
  height,
  title,
  startMdate,
  endMdate
}:{
  width: number,
  height: number,
  title: string,
  startMdate: MdateTz,
  endMdate: MdateTz
}){
  if(height > 30 && width > 50) return [title,`${startMdate.format("HH:mm")}~${endMdate.format("HH:mm")}`];
  if(height <= 30 && width > 50) return [`${title} ${startMdate.format("HH:mm")}~${endMdate.format("HH:mm")}`];
  if(height > 30 && width <= 50) return [title,`${startMdate.format("HH:mm")}~`,`${endMdate.format("HH:mm")}`];
  return [`${title} ${startMdate.format("HH:mm")}`]
}