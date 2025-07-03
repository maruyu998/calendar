import { useMemo } from "react";
import { useSetting } from "@client/contexts/SettingProvider";
import { SmallModal } from "@ymwc/react-components";
import Setting from "../setting/Setting";

export default function SettingModal({

}:{

}){
  const {
    isSettingOpen, setIsSettingOpen
  } = useSetting();

  const closeModal = useMemo<()=>void>(()=>(()=>{
    setIsSettingOpen(false);
  }), []);

  return (
    <SmallModal
      modalExtendClassName="w-3xl"
      isOpen={isSettingOpen}
      onClose={closeModal}
      title="Calendar Source Setting"
    >
      {
        isSettingOpen &&
        <Setting closeModal={closeModal}/>
      }
    </SmallModal>
  )
}