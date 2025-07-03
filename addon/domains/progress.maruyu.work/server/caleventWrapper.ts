import { fetchTaskTime, fetchTaskTimeList, updateTaskTime } from "./process/taskTime";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { CalendarIdType } from "@share/types/calendar";
import { HexColorType } from "@ymwc/utils";
import { TaskTimeIdType, TaskTimeType, TaskTimeWithFullType } from "../share/types/taskTime";
import { createTitle } from "../share/func/task";
import { UserIdType } from "@server/types/user";

function convertTaskTimeWithFullToCalevent(
  taskTimeWithTask: TaskTimeWithFullType,
  calendarId: CalendarIdType,
):CaleventType{
  const { id, task, startTime, endTime, updatedTime } = taskTimeWithTask;
  return {
    id: id as unknown as CaleventIdType,
    calendarId,
    title: createTitle(taskTimeWithTask.task),
    startTime,
    endTime,
    updatedAt: updatedTime,
    permissions: ["read", "write", "edit", "delete"],
    style: {
      mainColor: task.style.customColor ?? "#808080" as HexColorType,
      isAllDay: false,
    },
  };
}

export async function fetchCalevent(props:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  startTime: Date,
  endTime: Date
}):Promise<CaleventType[]>{
  const { calendarId, ...query } = props;
  const taskTimeList = await fetchTaskTimeList(query)
                            .then(responseObject=>responseObject.taskTimeList);
  const eventList = taskTimeList.map(taskTime=>convertTaskTimeWithFullToCalevent(taskTime, calendarId));
  return eventList;
}

export async function updateCalevent(props:{
  userId: UserIdType
  taskTimeId: TaskTimeIdType,
  calendarId: CalendarIdType,
  startTime?: Date,
  endTime?: Date,
}):Promise<CaleventType>{
  const { userId, taskTimeId, calendarId, ...updateData } = props;
  await updateTaskTime({ userId, id: taskTimeId, ...updateData });
  const taskTime = await fetchTaskTime({ userId, id: taskTimeId })
                        .then(responseObject=>responseObject.taskTime);
  const calevent = convertTaskTimeWithFullToCalevent(taskTime, calendarId);
  if(calevent == null) throw new Error("task has no startTime or endTime");
  return calevent;
}