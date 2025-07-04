import { useEffect, useMemo, useRef, useState } from 'react';
import { MdateTz, TimeZone } from '@ymwc/mdate';
import { useToast } from '@ymwc/react-core';
import { CalendarType } from '@client/types/calendar';
import { CaleventIdType, CaleventType } from '@client/types/calevent';
import { ProgressCalendarSchema, ProgressCalendarType } from '../types/calendar';
import { createTaskTime } from '../data/taskTime';
import { createTask } from '../data/task';
import { convertCreateItemResponseToClient as convertCreateTaskTimeItemResponseToClient } from '../types/taskTime';
import { 
  convertFetchListResponseToClient as convertFetchTaskListResponseToClient,
  convertCreateItemResponseToClient as convertCreateTaskItemResponseToClient,
  TaskWithFullType,
} from '../types/task';
import { 
  convertFetchListResponseToClient as convertFetchProjectListResponseToClient,
  ProjectWithFullType
} from "../types/project";
import { fetchTaskList } from "../data/task";
import { fetchProjectList } from "../data/project";
import TaskForm from '../components/TaskForm';
import ProjectForm from '../components/ProjectForm';
import DurationForm from '../components/DurationForm';
import MemoForm from '../components/MemoForm';
import TitleForm from '../components/TitleForm';
import DescriptionForm from '../components/DescriptionForm';
import EstimatedMinuteForm from '../components/EstimatedMinuteForm';
import ColorSelector from '../components/ColorSelector';
import { TaskPriorityType } from '../../share/types/task';
import { GenreSelector } from '../components/GenreSelector';
import { generateRandomColor, HexColorType } from '@ymwc/utils';
import { createTitle } from '../func/task';


function TaskTimeNew({
  clickedDate,
  progressCalendar,
  taskList,
  timezone,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  progressCalendar: ProgressCalendarType,
  taskList: TaskWithFullType[],
  timezone: TimeZone,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();
  const [ startMdate, setStartMdate ] = useState<MdateTz>(clickedDate);
  const [ endMdate, setEndMdate ] = useState<MdateTz>(clickedDate.forkAdd(15,'minute'));
  const [ task, setTask ] = useState<TaskWithFullType|null>(null);
  const [ memo, setMemo ] = useState<string>("");

  return (
    <>
      <TaskForm
        taskList={taskList}
        task={task}
        setTask={(task:TaskWithFullType|null)=>{ setTask(task) }}
      />
      <DurationForm 
        startMdate={startMdate}
        endMdate={endMdate}
        timezone={timezone}
        setDuration={(startMdate:MdateTz,endMdate:MdateTz)=>{
          if(startMdate.unix == startMdate.unix && endMdate.unix == endMdate.unix) return;
          if(startMdate.unix >= endMdate.unix) return addToast("InputError", "start >= end", "warning");
          setStartMdate(startMdate);
          setEndMdate(endMdate);
        }}
      />
      <hr className="h-px my-4 bg-gray-200 border-0"/>
      <MemoForm
        memo={memo} 
        setMemo={memo=>{ setMemo(memo) }}
      />
      <div className="mt-5 flex justify-end gap-2">
        {
          task && startMdate && endMdate &&
          <button 
            type="button" 
            className="
              rounded-full border border-gray-300 py-2 px-4 text-center text-sm transition-all shadow-sm
              text-gray-600 bg-red-300
              hover:shadow-lg hover:text-white hover:bg-red-600 hover:border-gray-800
            "
            onClick={e=>{
              if(startMdate.unix >= endMdate.unix) return addToast("InputError", "startTime >= endTime", "warning");
              if(task == null) return addToast("InputError", "task is not set", "warning");
              createTaskTime({
                calendarId: progressCalendar.id,
                taskId: task.id,
                startTime: startMdate.toDate(),
                endTime: endMdate.toDate(),
                memo,
              })
              .then(responseObject=>convertCreateTaskTimeItemResponseToClient(responseObject, taskList, timezone))
              .then(taskTime=>{
                refreshCaleventByCreate({
                  id: taskTime.id as unknown as CaleventIdType,
                  calendarId: progressCalendar.id,
                  title: createTitle(taskTime.task), 
                  startMdate: taskTime.startMdate,
                  endMdate: taskTime.endMdate,
                  permissions: ["read", "write", "edit", "delete"],
                  style: {
                    mainColor: taskTime.task.style.customColor ?? "#3b82f6" as HexColorType,
                    isAllDay: false,
                  },
                  updatedAt: new Date(),
                });
              })
              .catch(e=>{
                addToast("CreateTaskTimeError", e.message, "error");
              });
              closeModal();
            }}
          >Create</button>
        }
      </div>
    </>
  )
}

function TaskNew({
  clickedDate,
  progressCalendar,
  taskList,
  projectList,
  timezone,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  progressCalendar: ProgressCalendarType,
  taskList: TaskWithFullType[],
  projectList: ProjectWithFullType[],
  timezone: TimeZone,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();
  const [ startMdate, setStartMdate ] = useState<MdateTz>(clickedDate);
  const [ endMdate, setEndMdate ] = useState<MdateTz>(clickedDate.forkAdd(15,'minute'));
  const [ project, setProject ] = useState<ProjectWithFullType|null>(null);
  const [ title, setTitle ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");
  const [ estimatedMinute, setEstimatedMinute ] = useState<number>(0);
  const [ deadlineMdate, setDeadlineMdate ] = useState<MdateTz|null>(null);
  const [ priority, setPriority ] = useState<TaskPriorityType>("medium");
  const [ customColor, setCustomColor ] = useState<HexColorType>(generateRandomColor({saturation:0.5, value:0.7}));

  return (
    <>
      <TitleForm
        title={title} 
        setTitle={title=>{ setTitle(title) }}
      />
      <DescriptionForm
        description={description} 
        setDescription={description=>{ setDescription(description) }}
      />
      <ProjectForm
        projectList={projectList}
        project={project}
        setProject={(project:ProjectWithFullType)=>{ setProject(project) }}
      />
      <DurationForm 
        startMdate={startMdate}
        endMdate={endMdate}
        timezone={timezone}
        setDuration={(startMdate:MdateTz,endMdate:MdateTz)=>{
          if(startMdate.unix == startMdate.unix && endMdate.unix == endMdate.unix) return;
          if(startMdate.unix >= endMdate.unix) return addToast("InputError", "start >= end", "warning");
          setStartMdate(startMdate);
          setEndMdate(endMdate);
        }}
      />
      <hr className="h-px my-4 bg-gray-200 border-0"/>
      <EstimatedMinuteForm
        estimatedMinute={estimatedMinute}
        setEstimatedMinute={setEstimatedMinute}
      />
      <ColorSelector 
        color={customColor}
        setColor={setCustomColor}
      />
      <div className="mt-5 flex justify-end gap-2">
        {
          project && startMdate && endMdate &&
          <button 
            type="button" 
            className="
              rounded-full border border-gray-300 py-2 px-4 text-center text-sm transition-all shadow-sm
              text-gray-600 bg-red-300
              hover:shadow-lg hover:text-white hover:bg-red-600 hover:border-gray-800
            "
            onClick={e=>{
              if(startMdate.unix >= endMdate.unix) return addToast("InputError", "startTime >= endTime", "warning");
              if(project == null) return addToast("InputError", "project is not set", "warning");
              createTask({
                calendarId: progressCalendar.id,
                projectId: project.id,
                title,
                description,
                estimatedMinute,
                deadlineTime: deadlineMdate && deadlineMdate.toDate(),
                dependsOn: [],
                priority,
                recurringId: null,
                style: {
                  customColor 
                }
              })
              .then(responseObject=>convertCreateTaskItemResponseToClient(responseObject, taskList, timezone))
              .then(task=>(
                createTaskTime({
                  calendarId: progressCalendar.id,
                  taskId: task.id,
                  startTime: startMdate.toDate(),
                  endTime: endMdate.toDate(),
                  memo: "",
              })))
              .then(responseObject=>convertCreateTaskTimeItemResponseToClient(responseObject, taskList, timezone))
              .then(taskTime=>{
                refreshCaleventByCreate({
                  id: taskTime.id as unknown as CaleventIdType,
                  calendarId: progressCalendar.id,
                  title: createTitle(taskTime.task), 
                  startMdate: taskTime.startMdate, 
                  endMdate: taskTime.endMdate,
                  permissions: ["read", "write", "edit", "delete"],
                  style: {
                    mainColor: taskTime.task.style.customColor ?? "#3b82f6" as HexColorType,
                    isAllDay: false,
                  },
                  updatedAt: new Date(),
                });
              })
              .catch(e=>{
                addToast("CreateTaskError", e.message, "error");
              });
              closeModal();
            }}
          >Create</button>
        }
      </div>
    </>
  )
}


function ProgressNew({
  clickedDate,
  timezone,
  progressCalendar,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  progressCalendar: ProgressCalendarType,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  // const estimatedMinute = useMemo<number>(()=>(
  //   Math.floor((endMdate.unix - startMdate.unix) / MINUTE)
  // ), [startMdate, endMdate]);


  // const [ priority, setPriority ] = useState<number>(0);
  // const status = useMemo<TaskStatusType>(()=>{
  //   const now = Date.now();
  //   if(now < startMdate.unix) return "completed";
  //   if(now > endMdate.unix) return "planned";
  //   return "going";
  // }, [startMdate, endMdate])
  const [genre, setGenre] = useState<"taskTime"|"task"|"inbox">("taskTime");
  const [ taskList, setTaskList ] = useState<TaskWithFullType[]|null>(null);
  const [ projectList, setProjectList ] = useState<ProjectWithFullType[]|null>(null);

  useEffect(()=>{
    if(genre == "taskTime" || genre == "task"){
      fetchTaskList({ calendarId: progressCalendar.id })
      .then(responseObject=>convertFetchTaskListResponseToClient(responseObject, timezone))
      .then(taskList => {
        console.log({taskList});
        return taskList;
      })
      .then(taskList=>setTaskList(taskList))
      .catch(error => addToast("FetchError", error.message, "error"))
    }
    if(genre == "task"){
      fetchProjectList({ calendarId: progressCalendar.id })
      .then(responseObject=>convertFetchProjectListResponseToClient(responseObject, timezone))
      .then(projectList => {
        console.log({projectList});
        return projectList;
      })
      .then(projectList=>setProjectList(projectList))
      .catch(error => addToast("FetchError", error.message, "error"))
    }
  }, [genre]);

  return (
    <div className="mb-8">
      <GenreSelector genre={genre} setGenre={setGenre}/>
      {
        genre == "taskTime" && taskList &&
        <TaskTimeNew 
          clickedDate={clickedDate} 
          progressCalendar={progressCalendar} 
          taskList={taskList} 
          timezone={timezone}
          refreshCaleventByCreate={refreshCaleventByCreate}
          closeModal={closeModal}
        />
      }
      {
        genre == "task" && projectList && taskList &&
        <TaskNew
          clickedDate={clickedDate} 
          progressCalendar={progressCalendar} 
          taskList={taskList}
          projectList={projectList} 
          timezone={timezone}
          refreshCaleventByCreate={refreshCaleventByCreate}
          closeModal={closeModal}
        />
      }
      {/* <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-gray-900">Title</label>
        <input type="text"
          className="
            block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs 
            focus:ring-blue-500 focus:border-blue-500
          "
          onChange={e=>setTitle(e.currentTarget.value)}
        />
      </div>
      
      <div className="mb-1">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            defaultChecked={useDeadline} 
            onChange={e=>setUseDeadline(e.currentTarget.checked)}
            className="sr-only peer"
          />
          <div 
            className="
              relative w-9 h-5 bg-gray-200 
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              rounded-full peer 
              peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
              after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
            "
          ></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Set Deadline</span>
        </label>
      </div>
      {
        useDeadline && <>
          <input type="datetime-local"
            className="
              grow
              block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm 
              focus:ring-blue-500 focus:border-blue-500
            "
            // ref={deadlineRef}
            // max={endMdate.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
            onChange={e=>setDeadlineMdate(MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone))}
          />
        </>
      }

      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-gray-900">DataTime Range</label>
        <div className="flex">
          <input type="datetime-local"
            className="
              grow
              block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm 
              focus:ring-blue-500 focus:border-blue-500
            "
            ref={startTimeRef}
            max={keepduration?endMdate.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
            onChange={e=>updateTime({start:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone)})}
          />
          <span className="grow-0 my-auto mx-2"> ~ </span>
          <input type="datetime-local" 
            className="
              grow
              block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm 
              focus:ring-blue-500 focus:border-blue-500
            "
            ref={endTimeRef}
            min={keepduration?startMdate.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
            onChange={e=>updateTime({end:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone)})}
          />
        </div>
        <p className="block mb-1 text-xs font-medium text-gray-900">Estimated Minute: {estimatedMinute} min.</p>
      </div>
      <div className="mb-1">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            defaultChecked={keepduration} 
            onChange={e=>setKeepduration(e.currentTarget.checked)}
            className="sr-only peer"
          />
          <div 
            className="
              relative w-9 h-5 bg-gray-200 
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              rounded-full peer 
              peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
              after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
            "
          ></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Keep Duration</span>
        </label>
      </div>

      <div className="mb-1">
        <label className="block mb-1 text-sm font-medium text-gray-900">Priority</label>
        <input
          type="number"
          className="
            block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
            rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
          "
          defaultValue={priority}
          onChange={e=>setPriority(Number(e.currentTarget.value))}
        />
      </div>
      
      <div className="mb-1">
        <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
        <textarea
          className="
            block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
            rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
          "
          defaultValue={description}
          onChange={e=>setDescription(e.currentTarget.value)}
        ></textarea>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" 
          onClick={closeModal}
          className="
            text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center
          ">Cancel</button>
        <button type="button" 
          className="
            text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center
          "
          onClick={async (e)=>{
            if(startMdate.unix >= endMdate.unix) return addToast("InputError", "startMdate >= endMdate", "warning");
            createTask({ 
              calendarId: progressCalendar.id,
              title, description, startMdate, endMdate,
              estimatedMinute, deadlineMdate, priority, status,
            })
            .then(responseObject=>convertCreateItemResponseToClient(responseObject, timezone))
            .then(task=>{
              refreshCaleventByCreate({
                id: task.id as unknown as CaleventIdType,
                calendarId: progressCalendar.id,
                title:task.title, 
                startMdate:task.startMdate, 
                endMdate:task.endMdate,
                permissions: ["read", "write", "edit", "delete"],
                style: {
                  mainColor: "#333333" as HexColorType,
                  isAllDay: false,
                },
                updatedAt: new Date(),
              });
            })
            .catch(e=>{
              addToast("CreateCaleventError", e.message, "error");
            })
            closeModal()
          }}
        >Save</button>
      </div> */}
    </div>
  )
}

export default function CaleventNew({
  clickedDate,
  timezone,
  calendar,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  calendar: CalendarType,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();
  const progressCalendar = useMemo<ProgressCalendarType|null>(()=>{
    const { success, error, data: progressCalendar } = ProgressCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("FetchGcalEventFailed", error.message, "error");
      return null;
    }
    return progressCalendar;
  }, [ calendar ]);

  if(progressCalendar == null) return <></>;
  return (
    <ProgressNew 
      clickedDate={clickedDate} 
      timezone={timezone}
      progressCalendar={progressCalendar}
      refreshCaleventByCreate={refreshCaleventByCreate} 
      closeModal={closeModal}
    />
  )
}