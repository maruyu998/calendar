import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getDivRefWidth, getDivRefHeight } from '../utils/ReactRect';
import { useSetting } from './SettingProvider';
import { useStateSession } from 'maruyu-webcommons/react/reactUse';
import { useStatus } from './StatusProvider';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { range, sum } from 'maruyu-webcommons/commons/utils/number';
import { useTopLayout } from './TopLayoutProvider';

interface iDayWidths {
  diff: Record<string,number> // {day: string, width: number},
  exact: Record<string,number> // {day: string, width: number}
}

type CurtainLayoutType = {
  widths: {[dateString: string]: number;},
  minWidths: {[dateString: string]: number;},
  dayWidths: iDayWidths,
  setDayWidths: React.Dispatch<React.SetStateAction<iDayWidths>>,
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

export function CurtainLayoutProvider({children}){

  const { timezone, dayDuration, startDate, heightScale } = useSetting();
  const { today } = useStatus();
  const { curtainWidth, mainHeight } = useTopLayout();

  const [ calendarHeight, setCalendarHeight ] = useState<number>(0);
  const [ calendarLeft, setCalendarLeft ] = useState<number>(0);
  const [ calendarWidth, setCalendarWidth ] = useState<number>(0);
  const [ curtainVirtualHeight, setCurtainVirtualHeight ] = useState<number>(0);

  useEffect(()=>{
    setCalendarLeft(getDivRefWidth(timeScaleElm))
    setCalendarWidth(curtainWidth - getDivRefWidth(timeScaleElm))
    setCalendarHeight(mainHeight - getDivRefHeight(dayTopElm) - getDivRefHeight(dayEventElm))
  }, [curtainWidth, mainHeight])
  useEffect(()=>{
    setCurtainVirtualHeight(calendarHeight * heightScale / 100)
  }, [calendarHeight, heightScale])


  const defaultDayWidths:iDayWidths = {diff:{"-1":80,"0":100,"1":80,"2":70,"3":60},exact:{}}
  const [ dayWidths, setDayWidths ] = useStateSession<iDayWidths>("dayWidths", defaultDayWidths);
  
  const [ widths, setWidths ] = useState<{[dateString:string]:number}>({});
  const [ minWidths, setMinWidths ] = useState<{[dateString:string]:number}>({});
  
  useEffect(()=>{
    function calculateWidths(){
      function calculateMinWidth(date:MdateTz):number{
        const number = dayWidths.exact[date.format("YYYY-MM-DD")];
        if(number !== undefined) return number;
        for(let [day, number] of Object.entries(dayWidths.diff)){
          if(date.forkAdd(-Number(day),'date').isToday()) return number;
        }
        return 0;
      }
      let minWidths:Record<string,number> = {}
      for(let i=0; i<dayDuration; i++){
        const date = startDate.forkAdd(i,'date');
        const minWidth = calculateMinWidth(date);
        if(minWidth > 0) minWidths[date.format("YYYY-MM-DD")] = minWidth;
      }
      minWidths = Object.assign({},...Object.entries(minWidths).sort((a,b)=>b[1]-a[1]).map(w=>({[w[0]]:w[1]})))
      const widths = Object.assign({}, ...[...range(dayDuration)].map(i=>({
        [startDate.forkAdd(i,'date').format("YYYY-MM-DD")]: calendarWidth / dayDuration
      })))
      if(calendarWidth >= sum(Object.values(minWidths))){
        const appliedMinWidths = {}
        for(const [date,number] of Object.entries(minWidths)){
          if(widths[date] >= number) break;
          appliedMinWidths[date] = number;
          widths[date] = number;
          const appliedMinWidthsLength = Object.keys(appliedMinWidths).length;
          const appliedMinWidthsSum = sum(Object.values(appliedMinWidths));
          Object.entries(widths).filter(([date,_])=>!Object.keys(appliedMinWidths).includes(date)).forEach(([date,_])=>{
            widths[date] = (calendarWidth - appliedMinWidthsSum) / (dayDuration - appliedMinWidthsLength);
          });
        }
      }
      return { widths, minWidths }
    }
    const { widths, minWidths } = calculateWidths();
    setWidths(widths);
    setMinWidths(minWidths);
  }, [dayDuration, today, startDate, timezone, curtainWidth, dayWidths, calendarWidth])

  const timeScaleElm = useRef<HTMLDivElement>(null);
  const dayTopElm = useRef<HTMLDivElement>(null);
  const dayEventElm = useRef<HTMLDivElement>(null);
  const calendarElm = useRef<HTMLDivElement>(null);

  return (
    <CurtainLayoutContext.Provider
      value={{
        widths,
        minWidths,
        dayWidths,
        setDayWidths,
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