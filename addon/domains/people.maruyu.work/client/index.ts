import CaleventNew from "./pages/CaleventNew";
import CaleventEdit from "./pages/CaleventEdit";
import Setting from "./pages/Setting";
import { registerCalendarSource } from "@addon/client";
import { DOMAIN } from "../const";

registerCalendarSource({
  calendarSourceType: DOMAIN as any,
  uniqueKeyInSource: "activity",
  name: "People Activities",
  description: "Track personal activities and tasks"
});

registerCalendarSource({
  calendarSourceType: DOMAIN as any,
  uniqueKeyInSource: "birthday",
  name: "People Birthdays",
  description: "Track birthdays and anniversaries"
});

export {
  CaleventNew,
  CaleventEdit,
  Setting,
}