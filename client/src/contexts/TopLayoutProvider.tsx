import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getDivRefWidth, getDivRefHeight } from '../utils/ReactRect';
import { useSetting } from './SettingProvider';

type TopLayoutType = {
  windowSize: {width:number, height:number},
  curtainWidth: number,
  mainHeight: number,
  setWindowSize: React.Dispatch<React.SetStateAction<{width: number; height: number;}>>,
  setCurtainWidth: React.Dispatch<React.SetStateAction<number>>,
  setMainHeight: React.Dispatch<React.SetStateAction<number>>,
  wholeElm: React.RefObject<HTMLDivElement>,
  headerElm: React.RefObject<HTMLDivElement>,
  curtainElm: React.RefObject<HTMLDivElement>
}

const TopLayoutContext = createContext<TopLayoutType|undefined>(undefined);

export function useTopLayout(){
  const context = useContext(TopLayoutContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function TopLayoutProvider({children}){

  const { showTop, showSide } = useSetting();

  const [ windowSize, setWindowSize ] = useState<{width:number,height:number}>({width:0,height:0});
  const [ curtainWidth, setCurtainWidth ] = useState<number>(0);
  const [ mainHeight, setMainHeight ] = useState<number>(0);

  useEffect(()=>{
    const _setWindowSize = ()=>setWindowSize({width: window.innerWidth, height: window.innerHeight})
    _setWindowSize()
    setTimeout(_setWindowSize,500)
    window.addEventListener("load", ()=>setTimeout(_setWindowSize,500), false);
    window.addEventListener("resize", _setWindowSize);
    return ()=>window.removeEventListener("resize", _setWindowSize);
  }, []);

  const wholeElm = useRef<HTMLDivElement>(null);
  const headerElm = useRef<HTMLDivElement>(null);
  const curtainElm = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setCurtainWidth(getDivRefWidth(curtainElm));
    setMainHeight(getDivRefHeight(wholeElm)-getDivRefHeight(headerElm));
  }, [windowSize, showTop, showSide, setCurtainWidth, setMainHeight])

  return (
    <TopLayoutContext.Provider
      value={{
        windowSize,
        curtainWidth,
        mainHeight,
        setWindowSize,
        setCurtainWidth,
        setMainHeight,
        wholeElm,
        headerElm,
        curtainElm
      }}
    >{children}</TopLayoutContext.Provider>
  )
}
