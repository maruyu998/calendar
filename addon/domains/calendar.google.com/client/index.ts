import CaleventEdit from "./pages/CaleventEdit";
import CaleventNew from "./pages/CaleventNew";
import Setting from "./pages/Setting";
import { registerCalendarSource } from "@addon/client";
import { DOMAIN } from "../const";

registerCalendarSource({
  calendarSourceType: DOMAIN as any,
  name: "Google Calendar",
  description: "Connect your Google Calendar to sync events"
});

export {
  CaleventEdit,
  CaleventNew,
  Setting,
}