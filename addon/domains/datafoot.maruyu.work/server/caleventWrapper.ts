import { CalendarIdType } from "@share/types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { fetchAndroidAppUsageList } from "./process/androidAppUsage";
import { RawAndroidAppUsageType } from "./types/androidAppUsage";
import { HexColorType } from "@ymwc/utils";
import { UserIdType } from "@server/types/user";

function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

function safeParseDate(dateValue: any): Date | null {
  if (!dateValue) return null;
  
  if (dateValue instanceof Date) {
    return isValidDate(dateValue) ? dateValue : null;
  }
  
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue);
    return isValidDate(parsed) ? parsed : null;
  }
  
  return null;
}

function convertAndroidAppUsageToCalevent(
  appUsage: RawAndroidAppUsageType,
  calendarId: CalendarIdType,
  backgroundColor?: HexColorType,
):CaleventType | null {
  // 必須フィールドの検証
  const startTime = safeParseDate(appUsage.startTime);
  const endTime = safeParseDate(appUsage.endTime);
  const updatedAt = safeParseDate(appUsage.updatedAt) || new Date(); // updatedAtがない場合は現在時刻
  
  // startTimeとendTimeが無効な場合はnullを返す（フィルタリング対象）
  if (!startTime || !endTime) {
    console.warn(`Invalid date values in app usage data:`, {
      id: appUsage.id,
      appName: appUsage.appName,
      startTime: appUsage.startTime,
      endTime: appUsage.endTime
    });
    return null;
  }
  
  // startTime が endTime より後の場合もスキップ
  if (startTime.getTime() >= endTime.getTime()) {
    console.warn(`Invalid time range in app usage data:`, {
      id: appUsage.id,
      appName: appUsage.appName,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    });
    return null;
  }
  
  return {
    id: appUsage.id as CaleventIdType,
    calendarId,
    title: appUsage.appName || 'Unknown App',
    startTime,
    endTime,
    updatedAt,
    permissions: ["read"],
    style: {
      mainColor: backgroundColor ?? null,
      isAllDay: false,
    },
  }
}

export async function fetchCalevent({
  userId,
  calendarId,
  startTime,
  endTime,
  category,
  backgroundColor,
}:{
  userId: UserIdType,
  calendarId: CalendarIdType
  startTime: Date,
  endTime: Date,
  category: string,
  backgroundColor?: HexColorType,
}):Promise<CaleventType[]>{
  if(category == "androidAppUsage"){
    try {
      const appUsageList = await fetchAndroidAppUsageList({ userId, startTime, endTime });
      const eventList = appUsageList
        .map(au => convertAndroidAppUsageToCalevent(au, calendarId, backgroundColor))
        .filter((event): event is CaleventType => event !== null); // nullを除去
      
      console.log(`✅ Datafoot: Converted ${appUsageList.length} raw entries to ${eventList.length} valid events`);
      return eventList;
    } catch (error) {
      console.error('❌ Datafoot: Failed to fetch app usage data:', error);
      return [];
    }
  }
  return [];
}