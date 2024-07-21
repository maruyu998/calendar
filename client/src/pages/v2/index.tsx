import React from 'react';
import TopBar from '../../components/topbar/TopBar';
import SideBar from '../../components/sidebar/SideBar';
import Curtain from '../../components/curtain/Curtain';

import { useTopLayout } from '../../contexts/TopLayoutProvider';
import AllModal from '../../components/curtain/AllModal';

export default function Index() {
  const { wholeElm, headerElm, curtainElm, mainHeight } = useTopLayout();
  
  return (
    <div className="overflow-y-hidden h-screen flex flex-col bg-white" ref={wholeElm}>
      <AllModal/>
      <div ref={headerElm}>
        <TopBar/>
      </div>
      <div className={`flex flex-row h-[${mainHeight}px]`}>
        <div className="overflow-y-auto no-scrollbar">
          <SideBar/>
        </div>
        <div className="overflow-hidden w-full h-full" ref={curtainElm}>
          <Curtain/>
        </div>
      </div>
    </div>
  )
}