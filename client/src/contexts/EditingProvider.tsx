import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MdateTz } from '@ymwc/mdate';
import { CaleventType } from '@client/types/calevent';
import { useTop } from './TopProvider';

type EditingType = {
  isModalOpen: boolean,
  selectingCalevent: CaleventType|null,
  selectingNewDate: MdateTz|null,
  closeModal: ()=>void,
  createCalevent: (v:MdateTz)=>void,
  editCalevent: (v:CaleventType)=>void,
}

const EditingContext = createContext<EditingType|undefined>(undefined);

export function useEditing(){
  const context = useContext(EditingContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function EditingProvider({children}: {children: React.ReactNode}){

  const { pressedKeys } = useTop();

  const [ isModalOpen, _setIsModalOpen ] = useState<boolean>(false);
  const [ selectingCalevent, _setSelectingCalevent ] = useState<CaleventType|null>(null);
  const [ selectingNewDate, _setSelectingNewDate ] = useState<MdateTz|null>(null);

  const editCalevent = useMemo(()=>function(calevent:CaleventType){
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