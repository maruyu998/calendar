import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useMemo, useState } from 'react';
import { getPurposeList } from '../../share/func/log';
import { RiSearchLine } from '@remixicon/react';
import { aggregateQuota } from '../func/quota';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { QuotaFullType } from '@maruyu/time-sdk';

export default function QuotaForm({
  quotaList,
  quota,
  setQuota,
}:{
  quotaList: QuotaFullType[],
  quota: QuotaFullType|null,
  setQuota: (quota:QuotaFullType)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(quota==null) }, [quota]);

  const [draftQuota, setDraftQuota] = useState<QuotaFullType|null>(quota);
  const [quotaSearchKey, setQuotaSearchKey] = useState<string>("");

  function cancelEdit(){
    setDraftQuota(quota);
    setEditing(false);
  };
  function saveEdit(){
    if(draftQuota != null) setQuota(draftQuota);
    setEditing(false);
  }

  return (
    <>
      { quota && 
        <>
          <p className="text-xs text-gray-600">
            Purposes: <span className="font-medium">{getPurposeList(quota).join("/")}</span>
          </p>
          <div className="flex">
            <div className="flex-grow">
              <p className="text-md font-medium mb-1 text-gray-900">{quota.name}</p>
            </div>
            <div className="flex-shrink-0">
              {!editing ? (
                <button
                  onClick={()=>setEditing(true)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                ><RiPencilLine size={14}/></button>
              ) : (
                <button
                  onClick={cancelEdit}
                  className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
                ><RiResetLeftFill size={14}/>戻す</button>
              )}
            </div>
          </div>
        </>
      }
      { editing && (
        <div className="relative mx-2">
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
                onChange={e=>{
                  setQuotaSearchKey(e.currentTarget.value.trim());
                }}
              />
            </div>
            <select
              onChange={e=>setDraftQuota(quotaList.find(q=>q.id==e.currentTarget.value)??null)}
              className="
              bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2
              "
              defaultValue={quota?.id}
            >
              <option className="text-xs">Choose a quota</option>
              {
                aggregateQuota(quotaList, quotaSearchKey)
                .map(({purposesText, id, name})=>(
                  <option key={id} value={id}>[{purposesText}]{name}</option>
                ))
              }
            </select>
            { draftQuota && (quota == null || draftQuota.id != quota.id) && 
              <div className="flex items-end">
                <div className="flex-grow">
                  <p className="text-xs font-extralight">Selected Quota</p>
                  <p className="text-xs text-gray-600">Purpose: <span className="font-medium">{getPurposeList(draftQuota).join("/")}</span></p>
                  <p className="text-sm font-medium text-gray-900">{draftQuota.name}</p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={saveEdit}
                    className="m-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md"
                    title="保存"
                  >
                    <RiCheckLine size={16}/>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      )}
      { editing && <hr className="h-px my-4 bg-gray-200 border-0"/> }
    </>
  )
}

