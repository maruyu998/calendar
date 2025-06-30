import CaleventNew from "./pages/CaleventNew";
import CaleventEdit from "./pages/CaleventEdit";
import Setting from "./pages/Setting";
import { registerCalendarSource } from "@addon/client";
import { DOMAIN } from "../const";

registerCalendarSource({
  calendarSourceType: DOMAIN as any,
  name: "Progress Tracker",
  description: "Monitor project progress and task time"
});

export { 
  CaleventNew, 
  CaleventEdit,
  Setting,
}