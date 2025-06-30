import SettingForm from "./pages/SettingForm";
import CaleventNewForm from "./pages/CaleventNewForm";
import CaleventEditForm from "./pages/CaleventEditForm";
import { CalendarSourceType } from "@client/types/calendar";

interface CalendarSourceRegistration {
  calendarSourceType: CalendarSourceType;
  uniqueKeyInSource?: string;
  name: string;
  description: string;
}

let registeredCalendarSources: CalendarSourceRegistration[] | undefined;

function ensureInitialized() {
  if (!registeredCalendarSources) {
    registeredCalendarSources = [];
  }
}

export function registerCalendarSource(registration: CalendarSourceRegistration) {
  ensureInitialized();
  registeredCalendarSources!.push(registration);
}

export function getRegisteredCalendarSources(): CalendarSourceRegistration[] {
  ensureInitialized();
  return [...(registeredCalendarSources || [])];
}

export {
  SettingForm,
  CaleventNewForm,
  CaleventEditForm,
}