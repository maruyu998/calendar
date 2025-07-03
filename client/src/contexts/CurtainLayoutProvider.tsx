import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getDivRefWidth, getDivRefHeight } from '@client/utils/ReactRect';
import { useSetting } from './SettingProvider';
import { useTypeStateCookie } from 'maruyu-webcommons/react/reactUse';
import { useStatus } from './StatusProvider';
import { MdateTz } from '@ymwc/mdate';
import { range, sum } from 'maruyu-webcommons/commons/utils/number';
import { useTopLayout } from './TopLayoutProvider';
import { useEvents } from './EventsProvider';

interface iDayWidths {
  diff: Record<string,number> // {day: string, width: number},
  exact: Record<string,number> // {day: string, width: number}
}

type CurtainLayoutType = {
  widths: {[dateString: string]: number;},
  updateDayWidth: (date:MdateTz,width:number|undefined)=>void,
  checkIsDayWidthSet: (date:MdateTz)=>boolean,
  timeScaleElm: React.RefObject<HTMLDivElement>,
  dayTopElm: React.RefObject<HTMLDivElement>,
  dayEventElm: React.RefObject<HTMLDivElement>,
  calendarElm: React.RefObject<HTMLDivElement>,
  calendarLeft: number,
  calendarWidth: number,
  calendarHeight: number,
  curtainVirtualHeight: number
}

const CurtainLayoutContext = createContext<CurtainLayoutType|undefined>(undefined);

export function useCurtainLayout(){
  const context = useContext(CurtainLayoutContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function CurtainLayoutProvider({children}: {children: React.ReactNode}){

  const { timezone, dayDuration, startMdate, heightScale } = useSetting();
  const { today } = useStatus();
  const { curtainWidth, mainHeight } = useTopLayout();
  const { dayEventGroup } = useEvents();

  const [ calendarHeight, setCalendarHeight ] = useState<number>(0);
  const [ calendarLeft, setCalendarLeft ] = useState<number>(0);
  const [ calendarWidth, setCalendarWidth ] = useState<number>(0);
  const [ curtainVirtualHeight, setCurtainVirtualHeight ] = useState<number>(0);

  useEffect(()=>{
    setCalendarLeft(getDivRefWidth(timeScaleElm))
    setCalendarWidth(curtainWidth - getDivRefWidth(timeScaleElm))
    setCalendarHeight(mainHeight - getDivRefHeight(dayTopElm) - getDivRefHeight(dayEventElm))
  }, [curtainWidth, mainHeight, dayEventGroup])
  useEffect(()=>{
    setCurtainVirtualHeight(calendarHeight * heightScale / 100)
  }, [calendarHeight, heightScale])


  const defaultDayWidths:iDayWidths = {diff:{"-1":80,"0":100,"1":80,"2":70,"3":60},exact:{}}
  const [ dayWidths, setDayWidths ] = useTypeStateCookie<iDayWidths>(
    "dayWidths",
    defaultDayWidths,
    obj=>encodeURIComponent(JSON.stringify(obj)),
    str=>{ try{ return JSON.parse(decodeURIComponent(str)) }catch(error){ return defaultDayWidths } }
  );
  function updateDayWidth(date:MdateTz, width:number|undefined){
    const yymmdd = date.format("YYYY-MM-DD")
    const oldWidth = dayWidths.exact[yymmdd];
    const newWidth = width != undefined ? Math.max(0, width) : undefined;
    if(oldWidth != newWidth) {
      if(newWidth == undefined){
        const updatedExact = { ...dayWidths.exact };
        delete updatedExact[yymmdd];
        setDayWidths({ ...dayWidths, exact: updatedExact });
      }
      else setDayWidths({...dayWidths, exact:{...dayWidths.exact, [yymmdd]:newWidth}});
    }
  }
  function checkIsDayWidthSet(date:MdateTz){
    const yymmdd = date.format("YYYY-MM-DD");
    return dayWidths.exact[yymmdd] != undefined;
  }

  const [ widths, setWidths ] = useState<{[dateString:string]:number}>({});

  useEffect(()=>{
    function calculateMinWidth(date:MdateTz):number{
      const number = dayWidths.exact[date.format("YYYY-MM-DD")];
      if(number !== undefined) return number;
      for(const [day, number] of Object.entries(dayWidths.diff)){
        if(date.forkAdd(-Number(day),'date').isToday()) return number;
      }
      return 0;
    }
    function calculateWidths(){
      const minWidths:Record<string,number> = {};
      for(let i=0; i<dayDuration; i++){
        const date = startMdate.forkAdd(i,'date');
        const minWidth = calculateMinWidth(date);
        if(minWidth > 0) minWidths[date.format("YYYY-MM-DD")] = minWidth;
      }
      const widths = Object.assign({}, ...[...range(dayDuration)].map(i=>({
        [startMdate.forkAdd(i,'date').format("YYYY-MM-DD")]: calendarWidth / dayDuration
      })));
      if(calendarWidth < sum(Object.values(minWidths))) return widths;

      const appliedMinWidths:Record<string,number> = {}
      for(const [date,number] of Object.entries(minWidths).sort((a,b)=>b[1]-a[1])){
        if(widths[date] >= number) break;
        appliedMinWidths[date] = number;
        widths[date] = number;
        const appliedMinWidthsLength = Object.keys(appliedMinWidths).length;
        const appliedMinWidthsSum = sum(Object.values(appliedMinWidths));
        Object.entries(widths).filter(([date,_])=>!Object.keys(appliedMinWidths).includes(date)).forEach(([date,_])=>{
          widths[date] = (calendarWidth - appliedMinWidthsSum) / (dayDuration - appliedMinWidthsLength);
        });
      }
      return widths;
    }
    const widths = calculateWidths();
    setWidths(widths);
  }, [dayDuration, today, startMdate, timezone, curtainWidth, dayWidths, calendarWidth])

  const timeScaleElm = useRef<HTMLDivElement>(null);
  const dayTopElm = useRef<HTMLDivElement>(null);
  const dayEventElm = useRef<HTMLDivElement>(null);
  const calendarElm = useRef<HTMLDivElement>(null);

  return (
    <CurtainLayoutContext.Provider
      value={{
        widths,
        updateDayWidth,
        checkIsDayWidthSet,
        timeScaleElm,

        dayTopElm,
        dayEventElm,
        calendarElm,
        calendarLeft,
        calendarWidth,
        calendarHeight,
        curtainVirtualHeight
      }}
    >{children}</CurtainLayoutContext.Provider>
  )
}