import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStateRef } from "maruyu-webcommons/react/reactUse";

type AlertMessageType = {
  title: string|null, 
  content: string|null, 
  deleteAt: Date
}

type PressedKeysType = {
  esc: boolean,
  shift: boolean,
  ctrl: boolean,
  alt: boolean
}
const defaultPressedKeys = { 
  esc:false, shift:false, ctrl:false, alt:false
}

const DeviceGenres = ["pc", "smartphone"] as const;
type DeviceGenreType = typeof DeviceGenres[number];

type TopProviderType = {
  addAlert: (title:string|null,content:string|null,duration?:number)=>void,
  alertMessages: AlertMessageType[],
  pressedKeys: PressedKeysType,
  deviceGenre: DeviceGenreType
}

const TopContext = createContext<TopProviderType|undefined>(undefined);

export function useTop(){
  const context = useContext(TopContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function TopProvider({children}){

  const [ alertMessages, setAlertMessages ] = useState<AlertMessageType[]>([]);
  const alertMessagesRef = useRef<AlertMessageType[]>([]);
  useEffect(()=>{
    alertMessagesRef.current = alertMessages;
  }, [alertMessages])
  useEffect(()=>{
    function delteMessages(){
      if(alertMessagesRef.current == null) return;
      if(alertMessagesRef.current.length == 0) return;
      setAlertMessages(alertMessagesRef.current.filter(({deleteAt})=>deleteAt.getTime() > Date.now()))
    }
    const intervalId = setInterval(delteMessages.bind(alertMessages), 100);
    return ()=>clearInterval(intervalId);
  }, [])
  const addAlert = useMemo(()=>function(title:string|null, content:string|null, duration:number=5000){
    const deleteAt = new Date(Date.now() + duration);
    setAlertMessages([...alertMessages, { title, content, deleteAt }])
  }, [alertMessages, setAlertMessages]);

  const [pressedKeys, setPressedKeys, pressedKeysRef] = useStateRef<PressedKeysType>(defaultPressedKeys);
  useEffect(()=>{
    const listener = (e:KeyboardEvent, isPressing:boolean)=>{
      const newPressedKeys = {
        ...pressedKeysRef.current, 
        esc: isPressing && e.key == "Escape",
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
      };
      if(JSON.stringify(pressedKeysRef.current) !== JSON.stringify(newPressedKeys)){
        setPressedKeys(newPressedKeys);
      }
    }
    window.addEventListener("keydown", e=>listener(e,true));
    window.addEventListener("keyup", e=>listener(e,false));
    return ()=>{
      window.removeEventListener("keydown", e=>listener(e,true));
      window.removeEventListener("keyup", e=>listener(e,false));
    }
  }, [])

  const [ deviceGenre, setDeviceGenre ] = useState<DeviceGenreType>("pc");
  useEffect(()=>{
    function onResize(){
      const userAgent = navigator.userAgent;
      if(/iPhone|iPad|iPod|Android|Tablet/i.test(userAgent)){
        setDeviceGenre('smartphone');
      }else{
        setDeviceGenre('pc');
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return ()=>window.removeEventListener("resize", onResize);
  }, [])

  return (
    <TopContext.Provider
      value={{
        addAlert,
        alertMessages,
        pressedKeys,
        deviceGenre,
      }}
    >{children}</TopContext.Provider>
  )
}
