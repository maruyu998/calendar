import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { CalendarType } from "@share/types/calendar";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

export default abstract class AbstractAddon {
  static async fetchCaleventList(props:{
    userId: UserIdType,
    calendar: CalendarType,
    startTime: Date,
    endTime: Date,
  }):Promise<CaleventType[]>{
    const { calendar } = props;
    throw new Error(`Not implemented Getting Calevent List at ${calendar.calendarSource}`)
  }

  static async updateCaleventItem(props:{
    userId: UserIdType,
    calendar: CalendarType,
    caleventId: CaleventIdType,
    startTime?: Date,
    endTime?: Date,
  }):Promise<CaleventType>{
    const { calendar } = props;
    throw new Error(`Not implemented Updating Calevent Item at ${calendar.calendarSource}`)
  }
}