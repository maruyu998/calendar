import { SettingProvider } from "./contexts/SettingProvider";
import { TopLayoutProvider } from "./contexts/TopLayoutProvider";
import { StatusProvider } from "./contexts/StatusProvider";
import { CurtainLayoutProvider } from "./contexts/CurtainLayoutProvider";
import { EventsProvider } from "./contexts/EventsProvider";
import { EditingProvider } from "./contexts/EditingProvider";
import { DraggingProvider } from "./contexts/DraggingProvider";

export default function Provider({children}){
  return (
    <SettingProvider>
      <TopLayoutProvider>
        <StatusProvider>
          <CurtainLayoutProvider>
            <EventsProvider>
              <EditingProvider>
                <DraggingProvider>
                  {children}
                </DraggingProvider>
              </EditingProvider>
            </EventsProvider>
          </CurtainLayoutProvider>
        </StatusProvider>
      </TopLayoutProvider>
    </SettingProvider>
  )
}