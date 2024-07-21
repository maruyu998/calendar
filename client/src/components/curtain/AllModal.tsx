import { useEditing } from "../../contexts/EditingProvider";
import SmallModal from "../SmallModal";
import CaleventNew from "./CaleventNew";
import CaleventEdit from "./CaleventEdit";

export default function AllModal({

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