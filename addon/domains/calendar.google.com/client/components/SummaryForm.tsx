import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useState } from 'react';

export default function SummaryForm({
  summary,
  setSummary,
}:{
  summary: string,
  setSummary: (v:string)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(summary=="") }, [summary]);
  const [ draft, setDraft ] = useState<string>(summary);

  function cancelEdit(){
    setDraft(summary);
    setEditing(false);
  };
  function saveEdit(){
    setSummary(draft);
    setEditing(false);
  }

  return (
    <div className="w-full relative">
      {!editing ? (
        <div className="flex w-full">
          <p className="block mb-1 text-md font-medium text-gray-900 whitespace-pre-wrap flex-auto">{summary}</p>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          ><RiPencilLine size={14}/>{summary == "" ? "編集" : ""}</button>
        </div>
      ) : (
        <div className="relative">
          <input
            className="w-full text-sm border rounded-md p-2 my-0.5 pr-10 h-9"
            placeholder={summary}
            defaultValue={summary}
            onChange={(e) => setDraft(e.target.value)}
          />
          {
            draft != summary && draft != "" &&
            <button
              onClick={saveEdit}
              className="absolute bottom-1.5 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md"
              title="保存"
            >
              <RiCheckLine size={16}/>
            </button>
          }
        </div>
      )}
      { editing && draft != "" &&
        <div className="absolute -bottom-6 right-0 mb-1">
          <button
            onClick={cancelEdit}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          ><RiResetLeftFill size={14}/>戻す</button>
        </div>
      }
    </div>
  )
}