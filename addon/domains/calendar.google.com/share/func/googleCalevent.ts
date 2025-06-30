import { HexColorType } from "maruyu-webcommons/commons/utils/color";
import { GoogleCaleventColorList } from "../types/googleCalevent";

export function convertColidToColor(colorId:number|string):HexColorType|null{
  colorId = Number(colorId);
  if(colorId < 0 || colorId >= GoogleCaleventColorList.length) throw new Error(`colorId is not in range. ${colorId}`)
  return GoogleCaleventColorList[colorId];
}