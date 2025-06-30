import { useMemo } from "react";
import { CaleventType } from "@client/types/calevent";
import { CalendarType } from "@client/types/calendar";
import { createTimeRangeText, createDurationText } from "../utils/duration";
import { TimeZone } from "maruyu-webcommons/commons/utils/mdate";

export default function CaleventCommonView({
  calevent,
  calendar,
  timezone,
  loading,
}:{
  calevent: CaleventType,
  calendar: CalendarType,
  timezone: TimeZone,
  loading: boolean,
}){
  const timeRangeText = useMemo(()=>createTimeRangeText(calevent.startMdate, calevent.endMdate), [ calevent, timezone ]);
  const durationText = useMemo(()=>createDurationText(calevent.startMdate, calevent.endMdate), [ calevent, timezone ]);
  return (
    <div className="mb-5">
      <p className="block mb-1 text-md font-medium text-gray-900">{calevent.title}</p>
      <p className="block text-sm font-medium text-gray-900">{calendar.name}</p>
      <p className="flex gap-1 text-sm font-normal text-gray-900">{timeRangeText}</p>
      <p className="block text-sm font-normal text-gray-900">{durationText}</p>
      { loading &&
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      }
    </div>
  )
}