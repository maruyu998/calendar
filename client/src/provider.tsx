import { SettingProvider } from "./contexts/SettingProvider";
import { TopLayoutProvider } from "./contexts/TopLayoutProvider";
import { StatusProvider } from "./contexts/StatusProvider";
import { CurtainLayoutProvider } from "./contexts/CurtainLayoutProvider";
import { EventsProvider } from "./contexts/EventsProvider";
import { EditingProvider } from "./contexts/EditingProvider";
import { DraggingProvider } from "./contexts/DraggingProvider";

export default function Provider({children}: {children: React.ReactNode}): React.ReactElement {
  return (
    <SettingProvider>
      <TopLayoutProvider>
        <StatusProvider>
          <EventsProvider>
            <CurtainLayoutProvider>
              <EditingProvider>
                <DraggingProvider>
                  {children}
                </DraggingProvider>
              </EditingProvider>
            </CurtainLayoutProvider>
          </EventsProvider>
        </StatusProvider>
      </TopLayoutProvider>
    </SettingProvider>
  )
}