import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useMemo, useState } from 'react';
import { RiSearchLine } from '@remixicon/react';
import { aggregateTask } from '../func/task';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { TaskWithFullType } from '../types/task';
import { getProjectList } from '../func/project';

export default function TaskForm({
  taskList,
  task,
  setTask,
}:{
  taskList: TaskWithFullType[],
  task: TaskWithFullType|null,
  setTask: (task:TaskWithFullType|null)=>void,
}){
  const [taskSearchKey, setTaskSearchKey] = useState<string>("");
  return (
    <div className="mb-2">
      <label className={`
        block mb-1 text-sm font-medium
        ${task == null ? "text-red-600" : "text-gray-900"}
      `}>Task</label>
      { task == null ? (
        <div className="relative">
          <div className="mb-3">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <RiSearchLine className="w-4 h-4 text-gray-500"/>
              </div>
              <input type="search" 
                className="
                  block w-full p-2 ps-10 text-xs text-gray-900 border border-gray-300 
                  rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500
                "
                onChange={e=>{ setTaskSearchKey(e.currentTarget.value.trim()) }}
              />
            </div>
            <div className="h-48 w-full gap-y-0.5 overflow-y-auto">
              {/* {
                aggregateTask(taskList, taskSearchKey)
                .map(({projectText, id, title})=>(
                  <div key={id} 
                    className={`
                      block py-1 px-3 bg-white border rounded-lg shadow-sm cursor-pointer
                      ${task !== null && task.id === id  ? "hover:bg-indigo-200 bg-indigo-100 border-red-200"
                                                         : "hover:bg-gray-100 bg-white border-gray-200"
                      }
                    `}
                    onClick={e=>setTask(taskList.find(q=>q.id==id)??null)}
                  >
                    <p className="text-xs font-light">{projectText}</p>
                    <p className="text-sm">{title}</p>
                  </div>
                ))
              } */}
            </div>
          </div>
        </div>
      ) : (
        <div onClick={e=>setTask(null)} 
          className="block py-1 px-3 bg-white border rounded-lg shadow-sm 
                  hover:bg-indigo-200 border-gray-50 cursor-pointer"          
        >
          <p className="text-xs font-light">{getProjectList(task.project).join(" / ")}</p>
          <p className="text-sm">{task.title}</p>
        </div>
      )}
    </div>
  )
}

