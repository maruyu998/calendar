import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import Linkify from 'react-linkify';

export default function MemoForm({
  memo,
  setMemo,
}:{
  memo: string,
  setMemo: (v:string)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(false) }, [memo]);
  const [ draft, setDraft ] = useState<string>(memo);

  function cancelEdit(){
    setDraft(memo);
    setEditing(false);
  };
  function saveEdit(){
    setMemo(draft);
    setEditing(false);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <label className="block mb-1 text-sm font-medium text-gray-900">Memo</label>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          ><RiPencilLine size={14}/>{memo == "" ? "編集" : ""}</button>
        ) : (
          <button
            onClick={cancelEdit}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          ><RiResetLeftFill size={14}/>戻す</button>
        )}
      </div>
      {!editing ? (
        <Linkify 
          componentDecorator={(decoratedHref, decoratedText, key)=>(
            <a target="blank" href={decoratedHref} key={key}
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >{decoratedText}</a>
          )}
        >
          <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{memo}</p>
        </Linkify>
      ) : (
        <div className="relative">
          <textarea
            className="w-full text-sm border border-gray-300 rounded p-2 pr-10 h-24"
            placeholder={memo}
            defaultValue={memo}
            onChange={(e) => setDraft(e.target.value)}
          />
          {
            draft != memo &&
            <button
              onClick={saveEdit}
              className="absolute bottom-3 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md"
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