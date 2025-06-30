import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import Linkify from 'react-linkify';

export default function TitleForm({
  title,
  setTitle,
}:{
  title: string,
  setTitle: (v:string)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(title=="") }, [title]);
  const [ draft, setDraft ] = useState<string>(title);

  function cancelEdit(){
    setDraft(title);
    setEditing(false);
  };
  function saveEdit(){
    setTitle(draft);
    setEditing(false);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <label className={`
          block text-sm font-medium
          ${title == "" ? "text-red-600" : "text-gray-900"}
        `}>Title</label>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          ><RiPencilLine size={14}/>{title == "" ? "編集" : ""}</button>
        ) : (
          <button
            onClick={cancelEdit}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          ><RiResetLeftFill size={14}/>戻す</button>
        )}
      </div>
      {!editing ? (
        <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{title}</p>
      ) : (
        <div className="relative">
          <input
            className="w-full text-sm border rounded p-2 my-0.5 pr-10 h-9"
            placeholder={title}
            defaultValue={title}
            onChange={(e) => setDraft(e.target.value)}
          />
          {
            draft != title &&
            <button
              onClick={saveEdit}
              className="absolute bottom-1 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md"
              title="保存"
            >
              <RiCheckLine size={16}/>
            </button>
          }
        </div>
      )}
    </>
  )
}