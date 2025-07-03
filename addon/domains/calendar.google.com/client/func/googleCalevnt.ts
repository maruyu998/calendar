import { MdateTz, TimeZone } from "@ymwc/mdate";
import { GoogleCaleventDateType } from "../../share/types/googleCalevent";

export function convertGoogleCaleventDateToMdate(
  date: GoogleCaleventDateType,
  defaultTimezone: TimeZone,
):MdateTz{
  const timezone = date.timeZone || defaultTimezone;
  if(date.dateTime){
    return MdateTz.parseFormat(date.dateTime, "YYYY-MM-DDYHH:mm:ss", timezone);
  }
  return MdateTz.parseFormat(date.date!, "YYYY-MM-DD", timezone);
}