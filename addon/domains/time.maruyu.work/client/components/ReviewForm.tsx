import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import Linkify from 'react-linkify';

export default function ReviewForm({
  review,
  setReview,
}:{
  review: string,
  setReview: (v:string)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(false) }, [review]);
  const [ draft, setDraft ] = useState<string>(review);

  function cancelEdit(){
    setDraft(review);
    setEditing(false);
  };
  function saveEdit(){
    setReview(draft);
    setEditing(false);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <label className="block mb-1 text-sm font-medium text-gray-900">Review</label>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          ><RiPencilLine size={14}/>{review == "" ? "編集" : ""}</button>
        ) : (
          <button
            onClick={cancelEdit}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          ><RiResetLeftFill size={14} />戻す</button>
        )}
      </div>
      {!editing ? (
        <Linkify 
          componentDecorator={(decoratedHref: string, decoratedText: string, key: number)=>(
            <a target="blank" href={decoratedHref} key={key}
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >{decoratedText}</a>
          )}
        >
          <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{review}</p>
        </Linkify>
      ) : (
        <div className="relative">
          <textarea
            className="w-full text-sm border rounded p-2 pr-10 h-24"
            placeholder={review}
            defaultValue={review}
            onChange={(e) => setDraft(e.target.value)}
          />
          {
            draft != review &&
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