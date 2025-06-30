import { CaleventType } from '@client/types/calevent';
import { CaleventEditForm } from "@addon/client";
import { useMemo } from 'react';
import { useStatus } from '@client/contexts/StatusProvider';
import { useEvents } from '@client/contexts/EventsProvider';
import { useSetting } from '@client/contexts/SettingProvider';

export default function CaleventEdit({
  calevent,
  closeModal
}:{
  calevent: CaleventType,
  closeModal: ()=>void,
}): React.ReactElement {
  const {
    refreshCaleventByCreate,
    refreshCaleventByUpdate,
    refreshCaleventByRemove,
  } = useEvents();
  const { timezone } = useSetting();
  const { calendarList } = useStatus();
  const calendar = useMemo(()=>calendarList.find(c=>c.id==calevent.calendarId), [calevent, calendarList])
  
  if (!calendar) {
    return <div>Calendar not found</div>;
  }
  
  return (
    <div>
      <CaleventEditForm 
        calevent={calevent} 
        calendar={calendar} 
        timezone={timezone}
        closeModal={closeModal}
        refreshCaleventByCreate={refreshCaleventByCreate}
        refreshCaleventByUpdate={refreshCaleventByUpdate}
        refreshCaleventByRemove={refreshCaleventByRemove}
      />
    </div>
  )
}