import { hsvToRgb, parseColor, printColor, rgbToHsv } from "maruyu-webcommons/commons/utils/color";
import { Mdate, MdateTz } from "maruyu-webcommons/commons/utils/mdate";
import { CaleventType } from "@client/types/calevent";

export function getBackgroundColor(calevent: CaleventType){
  if(calevent.endMdate.unix >= Mdate.now().unix) return calevent.style.mainColor;
  const { hue, saturation, value } = rgbToHsv(parseColor(calevent.style.mainColor));
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