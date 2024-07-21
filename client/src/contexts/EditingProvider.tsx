import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStateRef } from 'maruyu-webcommons/react/reactUse';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { CaleventClientType } from 'mtypes/v2/Calevent';
import { useTop } from './TopProvider';

type EditingType = {
  isModalOpen: boolean,
  selectingCalevent: CaleventClientType|null,
  selectingNewDate: MdateTz|null,
  closeModal: ()=>void,
  createCalevent: (v:MdateTz)=>void,
  editCalevent: (v:CaleventClientType)=>void,
}

const EditingContext = createContext<EditingType|undefined>(undefined);

export function useEditing(){
  const context = useContext(EditingContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function EditingProvider({children}){
  
  const { pressedKeys } = useTop();

  const [ isModalOpen, _setIsModalOpen ] = useState<boolean>(false);
  const [ selectingCalevent, _setSelectingCalevent ] = useState<CaleventClientType|null>(null);
  const [ selectingNewDate, _setSelectingNewDate ] = useState<MdateTz|null>(null);

  const editCalevent = useMemo(()=>function(calevent:CaleventClientType){
    _setSelectingCalevent(calevent);
    _setIsModalOpen(true);
  }, [_setSelectingCalevent, _setIsModalOpen]);
  const createCalevent = useMemo(()=>function(startMdate:MdateTz){
    _setSelectingNewDate(startMdate);
    _setIsModalOpen(true);
  }, [_setSelectingNewDate, _setIsModalOpen]);
  const closeModal = useMemo(()=>function(){
    _setIsModalOpen(false);
    _setSelectingCalevent(null);
    _setSelectingNewDate(null);
  }, [_setIsModalOpen, _setSelectingCalevent, _setSelectingNewDate]);
  useEffect(()=>{
    if(pressedKeys.esc && isModalOpen) closeModal()
  }, [pressedKeys])

  return (
    <EditingContext.Provider
      value={{
        isModalOpen,
        selectingCalevent,
        selectingNewDate,
        closeModal,
        createCalevent,
        editCalevent,
      }}
    >{children}</EditingContext.Provider>
  )
}