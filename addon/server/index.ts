import { registerCalendarSourceHandler } from "@server/services/calevent";

import calendarGoogleCom from "@addon/domains/calendar.google.com/server/register";
import calendarMaruyuWork from "@addon/domains/calendar.maruyu.work/server/register";
import datafootMaruyuWork from "@addon/domains/datafoot.maruyu.work/server/register";
import healthMaruyuWork from "@addon/domains/health.maruyu.work/server/register";
import peopleMaruyuWork from "@addon/domains/people.maruyu.work/server/register";
import progressMaruyuWork from "@addon/domains/progress.maruyu.work/server/register";
import timeMaruyuWork from "@addon/domains/time.maruyu.work/server/register";

export default function(){
  calendarGoogleCom(registerCalendarSourceHandler);
  calendarMaruyuWork(registerCalendarSourceHandler);
  datafootMaruyuWork(registerCalendarSourceHandler);
  healthMaruyuWork(registerCalendarSourceHandler);
  peopleMaruyuWork(registerCalendarSourceHandler);
  progressMaruyuWork(registerCalendarSourceHandler);
  timeMaruyuWork(registerCalendarSourceHandler);
}