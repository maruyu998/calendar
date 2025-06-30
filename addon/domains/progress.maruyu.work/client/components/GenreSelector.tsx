
const selectedClass =   "inline-block p-2 border-b-2 rounded-t-lg text-blue-600 border-blue-600 active";
const unSelectedClass = "inline-block p-2 border-b-2 rounded-t-lg border-transparent hover:text-gray-600 hover:border-gray-300";

export function GenreSelector({
  genre,
  setGenre,
}:{
  genre: "taskTime"|"task"|"inbox",
  setGenre: (v:"taskTime"|"task"|"inbox")=>void,
}){
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-2">
      <ul className="flex flex-wrap -mb-px">
        <li className="me-2" onClick={()=>setGenre("taskTime")}>
          <a href="#" className={ genre == "taskTime" ? selectedClass :  unSelectedClass }>TaskTime</a>
        </li>
        <li className="me-2" onClick={()=>setGenre("task")}>
          <a href="#" className={ genre == "task" ? selectedClass :  unSelectedClass }>Task</a>
        </li>
        {/* <li className="me-2" onClick={()=>setGenre("project")}>
          <a href="#" className={ genre == "project" ? selectedClass :  unSelectedClass }>New Project</a>
        </li> */}
        <li className="me-2" onClick={()=>setGenre("inbox")}>
          <a href="#" className={ genre == "inbox" ? selectedClass :  unSelectedClass }>Inbox</a>
        </li>
      </ul>
    </div>
  )
}