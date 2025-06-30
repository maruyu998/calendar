import React from 'react';
import TopBar from '@client/components/index/topbar/TopBar';
import SideBar from '@client/components/index/sidebar/SideBar';
import Curtain from '@client/components/index/curtain/Curtain';

import { useTopLayout } from '@client/contexts/TopLayoutProvider';
import SettingModal from "@client/components/index/modal/SettingModal"
import CaleventModal from '@client/components/index/modal/CaleventModal';

export default function Index() {
  const { wholeElm, headerElm, curtainElm, mainHeight } = useTopLayout();

  return (
    <div className="overflow-y-hidden h-screen flex flex-col bg-white" ref={wholeElm}>
      <SettingModal />
      <CaleventModal/>
      <div ref={headerElm}>
        <TopBar/>
      </div>
      <div className="flex flex-row" style={{ height: `${mainHeight}px` }}>
        <div className="overflow-y-auto no-scrollbar flex-none">
          <SideBar/>
        </div>
        <div className="overflow-hidden w-full h-full" ref={curtainElm}>
          <Curtain/>
        </div>
      </div>
    </div>
  )
}