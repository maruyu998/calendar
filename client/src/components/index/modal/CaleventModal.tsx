import { useEditing } from "@client/contexts/EditingProvider";
import { SmallModal } from "@ymwc/react-components";
import CaleventNew from "../curtain/CaleventNew";
import CaleventEdit from "../curtain/CaleventEdit";

export default function CaleventModal({

}:{

}){
  const {
    isModalOpen,
    closeModal,
    selectingCalevent,
    selectingNewDate,
  } = useEditing();

  return (
    <SmallModal
      modalExtendClassName="w-3xl"
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      {
        selectingCalevent &&
        <CaleventEdit
          calevent={selectingCalevent}
          closeModal={closeModal}
        />
      }
      {
        selectingNewDate &&
        <CaleventNew
          clickedDate={selectingNewDate}
          closeModal={closeModal}
        />
      }
    </SmallModal>
  )
}