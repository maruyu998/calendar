import React, { useEffect, useMemo, useState } from 'react';
import { SettingForm, getRegisteredCalendarSources } from "@addon/client";
import { useStatus } from '@client/contexts/StatusProvider';
import { CalendarSourceType, CalendarType } from '@client/types/calendar';
import SmallModal from 'maruyu-webcommons/react/components/SmallModal';

export default function Setting({
  closeModal,
}:{
  closeModal: ()=>void,
}){
  const { calendarList } = useStatus();
  const [ calendarSource, setCalendarSource ] = useState<CalendarSourceType|null>(null);
  const [ showConfigModal, setShowConfigModal ] = useState(false);
  
  const existingCalendarSources = useMemo(()=>[...new Set(calendarList.map(c => c.calendarSource))], [calendarList]);
  
  // すべてのカレンダーソースを統合（既存 + 利用可能）
  const allCalendarSources = useMemo(()=>{
    const registered = getRegisteredCalendarSources();
    const sourceList = registered.map(source => ({
      ...source,
      isConfigured: existingCalendarSources.includes(source.calendarSourceType)
    }));
    return sourceList.sort((a, b) => {
      // 設定済みのものを上に、未設定のものを下に
      if (a.isConfigured && !b.isConfigured) return -1;
      if (!a.isConfigured && b.isConfigured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [existingCalendarSources]);

  return (
    <div onClick={e=>e.stopPropagation()}>
      <div className="mb-6">
        <label className="block mb-3 text-sm font-medium text-gray-900">Available Calendar Sources</label>
        {allCalendarSources.length === 0 ? (
          <p className="text-gray-500 text-sm">No calendar sources available.</p>
        ) : (
          <div className="space-y-3">
            {allCalendarSources.map((source, index) => (
              <div key={`${source.calendarSourceType}-${source.uniqueKeyInSource || index}`}>
                <div 
                  className={`
                    border rounded-lg p-4 transition-all duration-200 cursor-pointer
                    border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm
                  `}
                  onClick={() => {
                    setCalendarSource(source.calendarSourceType);
                    setShowConfigModal(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        source.isConfigured 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {source.isConfigured ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600">{source.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {source.calendarSourceType}
                          {source.uniqueKeyInSource && ` (${source.uniqueKeyInSource})`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        source.isConfigured 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {source.isConfigured ? 'Configured' : 'Available'}
                      </span>
                      <svg 
                        className="w-4 h-4 text-gray-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 設定モーダル */}
      <SmallModal
        isOpen={showConfigModal && !!calendarSource}
        onClose={() => setShowConfigModal(false)}
        title={
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {allCalendarSources.find(s => s.calendarSourceType === calendarSource)?.name || calendarSource}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {allCalendarSources.find(s => s.calendarSourceType === calendarSource)?.description}
            </p>
          </div>
        }
        modalExtendClassName="max-w-2xl"
      >
        {calendarSource && (
          <SettingForm 
            calendarSource={calendarSource} 
            closeModal={() => {
              setShowConfigModal(false);
              closeModal();
            }}
          />
        )}
      </SmallModal>
    </div>
  )
}