import CaleventEdit from "./pages/CaleventEdit";
import CaleventNew from "./pages/CaleventNew";
import Setting from "./pages/Setting";
import { registerCalendarSource } from "@addon/client";
import { DOMAIN } from "../const";

registerCalendarSource({
  calendarSourceType: DOMAIN as any,
  name: "People",
  description: "Track people activities and birthdays"
});

export {
  CaleventEdit,
  CaleventNew,
  Setting
}