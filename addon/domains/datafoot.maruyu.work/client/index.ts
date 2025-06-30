import CaleventNew from "./pages/CaleventNew";
import CaleventEdit from "./pages/CaleventEdit";
import Setting from "./pages/Setting";
import { registerCalendarSource } from "@addon/client";
import { DOMAIN } from "../const";

registerCalendarSource({
  calendarSourceType: DOMAIN as any,
  name: "Datafoot",
  description: "Track Android app usage data"
});

export {
  CaleventNew,
  CaleventEdit,
  Setting
}